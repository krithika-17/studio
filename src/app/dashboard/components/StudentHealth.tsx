'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HeartPulse, QrCode } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if(selectedStudentId) {
        const student = students.find(s => s.id === selectedStudentId) || null;
        setSelectedStudent(student);

        if(student) {
            const qrData = JSON.stringify({
                studentId: student.id,
                name: student.name,
                status: student.status,
                // In a real app, this would be a secure link to the student's health profile
                profileUrl: `/dashboard/student-health/${student.id}` 
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

    } else {
        setSelectedStudent(null);
        setQrCodeUrl(null);
    }
  }, [selectedStudentId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Student Health Status</CardTitle>
        </div>
        <CardDescription>Select a student to view their health status and generate a QR code for their profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
  );
}
