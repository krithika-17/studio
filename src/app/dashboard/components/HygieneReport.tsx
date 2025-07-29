'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Sparkles, AlertTriangle, Video, Upload } from 'lucide-react';
import Image from 'next/image';
import { checkHygiene, CheckHygieneOutput } from '@/ai/flows/check-hygiene';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function HygieneReport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckHygieneOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Turn off camera when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setPreviewUrl(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        setIsCameraOn(true);
        setResult(null);
        setPreviewUrl(null);
        setFile(null);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setIsCameraOn(false);
        toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
        });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if(context){
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setPreviewUrl(dataUrl);
            stopCamera();
        }
    }
  };
  
  const handleSubmit = async () => {
    if (!previewUrl) {
        toast({ title: 'No photo available', description: 'Please upload or capture a photo to analyze.', variant: 'destructive'});
        return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await checkHygiene({ photoDataUri: previewUrl });
      setResult(aiResult);
      toast({ title: 'Analysis Complete', description: 'AI hygiene assessment is ready.'});
    } catch (error) {
      console.error(error);
      toast({ title: 'Analysis Failed', description: 'Could not analyze the image. Please try again.', variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentPhotoForAnalysis = previewUrl;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Hygiene Reporting</CardTitle>
        </div>
        <CardDescription>Upload or capture a kitchen photo for AI-based hygiene analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" onClick={stopCamera}><Upload className="mr-2"/>Upload File</TabsTrigger>
            <TabsTrigger value="camera" onClick={startCamera}><Video className="mr-2"/>Use Camera</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
             <Input id="hygiene-photo" type="file" accept="image/*" onChange={handleFileChange} />
          </TabsContent>
          <TabsContent value="camera">
            <div className="space-y-2">
                {isCameraOn ? (
                    <div className="space-y-2">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline/>
                        <Button onClick={handleCapture} className="w-full"><Camera className="mr-2"/>Capture Photo</Button>
                    </div>
                ) : (
                    hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                      </AlertDescription>
                    </Alert>
                    )
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
          </TabsContent>
        </Tabs>
        
        {currentPhotoForAnalysis && (
          <div className="space-y-4">
            <h3 className="font-medium">Photo for Analysis</h3>
            <div className="relative mt-2 h-48 w-full overflow-hidden rounded-md border">
              <Image src={currentPhotoForAnalysis} alt="Hygiene Report Preview" layout="fill" objectFit="cover" data-ai-hint="kitchen hygiene"/>
            </div>
          </div>
        )}

        {result && (
          <div className="flex items-center gap-2 rounded-md border bg-card p-3">
            {result.cleanliness === 'Clean' ? 
                <Sparkles className="h-5 w-5 text-primary" /> : 
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />}
            <div>
              <p className="font-semibold text-card-foreground">AI Assessment: {result.cleanliness}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading || !currentPhotoForAnalysis} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Analyzing...' : 'Analyze Photo'}
        </Button>
      </CardFooter>
    </Card>
  );
}
