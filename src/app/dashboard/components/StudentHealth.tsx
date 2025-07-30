'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HeartPulse, QrCode, ScanLine, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import jsQR from 'jsqr';

const students = [
    { id: 'S001', name: 'Rohan Sharma', status: 'Good', statusVariant: 'default', details: 'Normal growth and active.'},
    { id: 'S002', name: 'Priya Patel', status: 'Needs Attention', statusVariant: 'secondary', details: 'Slightly underweight. Monitor diet.'},
    { id: 'S003', name: 'Amit Singh', status: 'Urgent', statusVariant: 'destructive', details: 'Showing signs of fever and fatigue.'},
    { id: 'S004', name: 'Sneha Verma', status: 'Good', statusVariant: 'default', details: 'Healthy and meeting all milestones.'},
];

type Student = typeof students[0];

const statusStyles = {
    'Good': 'bg-green-500 hover:bg-green-600',
    'Needs Attention': 'bg-yellow-500 hover:bg-yellow-600',
    'Urgent': 'bg-red-500 hover:bg-red-600'
}

export function StudentHealth() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const { toast } = useToast();

  const selectStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId) || null;
    setSelectedStudent(student);
    setSelectedStudentId(studentId);

    if(student) {
        const qrData = JSON.stringify({
            studentId: student.id,
            name: student.name,
            status: student.status,
        });
        QRCode.toDataURL(qrData)
            .then(url => {
                setQrCodeUrl(url);
            })
            .catch(err => {
                console.error(err);
                setQrCodeUrl(null);
            });
    } else {
         setQrCodeUrl(null);
    }
  }

  useEffect(() => {
    if(selectedStudentId) {
        selectStudent(selectedStudentId)
    } else {
        setSelectedStudent(null);
        setQrCodeUrl(null);
    }
  }, [selectedStudentId]);

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            if(context){
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code) {
                    try {
                        const data = JSON.parse(code.data);
                        if(data.studentId && students.some(s => s.id === data.studentId)) {
                            selectStudent(data.studentId);
                            toast({ title: 'Student Found!', description: `Displaying health status for ${data.name}.` });
                            stopScan();
                        }
                    } catch(e) {
                         toast({ title: 'Invalid QR Code', description: 'This QR code is not a valid student health card.', variant: 'destructive' });
                         stopScan();
                    }
                }
            }
        }
    }
    requestRef.current = requestAnimationFrame(tick);
  };
  
  const startScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsScannerOpen(true);
            requestRef.current = requestAnimationFrame(tick);
        }
      } catch (error) {
          console.error("Error accessing camera: ", error);
          toast({ title: 'Camera Error', description: 'Could not access the camera. Please check permissions.', variant: 'destructive' });
      }
  };

  const stopScan = () => {
    setIsScannerOpen(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Student Health Status</CardTitle>
        </div>
        <CardDescription>Select a student to view their health status, or scan a QR code to look them up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="student-select">Select Student</Label>
                   <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                    <SelectTrigger id="student-select">
                        <SelectValue placeholder="Select a student..." />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>{student.name} ({student.id})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                    <Label>Scan QR Code</Label>
                    <Button onClick={startScan} variant="outline" className="w-full">
                        <ScanLine className="mr-2"/> Scan Student QR Code
                    </Button>
               </div>
          </div>
          
          {selectedStudent && (
            <Card className="bg-muted/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{selectedStudent.name}</CardTitle>
                        <Badge className={cn("text-white", statusStyles[selectedStudent.status as keyof typeof statusStyles])}>{selectedStudent.status}</Badge>
                    </div>
                    <CardDescription>ID: {selectedStudent.id}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                   <div className="md:col-span-2 space-y-2">
                        <h4 className="font-semibold">Health Details:</h4>
                        <p className="text-sm">{selectedStudent.details}</p>
                   </div>
                   <div className="flex flex-col items-center justify-center space-y-2">
                        {qrCodeUrl ? (
                            <Image src={qrCodeUrl} alt="Student QR Code" width={128} height={128} data-ai-hint="qr code"/>
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md">
                                <p className="text-xs text-muted-foreground text-center">QR Code</p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">Scan for profile link</p>
                   </div>
                </CardContent>
            </Card>
          )}
      </CardContent>
       <CardFooter>
          <Button disabled={!qrCodeUrl} className="w-full">
            <QrCode className="mr-2"/>
            Print Health Card
          </Button>
      </CardFooter>
    </Card>
    <Dialog open={isScannerOpen} onOpenChange={(open) => !open && stopScan()}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Scan Student QR Code</DialogTitle>
                <DialogDescription>Point your camera at the QR code on the student's health card.</DialogDescription>
            </DialogHeader>
            <div className="relative">
                <video ref={videoRef} className="w-full h-auto rounded-md bg-muted" autoPlay playsInline />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-4 border-primary/50 rounded-lg" />
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
             <Button variant="outline" onClick={stopScan}>
                <X className="mr-2"/>
                Cancel
            </Button>
        </DialogContent>
    </Dialog>
    </>
  );
}
