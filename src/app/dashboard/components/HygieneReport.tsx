'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { checkHygiene, CheckHygieneOutput } from '@/ai/flows/check-hygiene';
import { useToast } from '@/hooks/use-toast';

export function HygieneReport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckHygieneOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async () => {
    if (!file || !previewUrl) {
        toast({ title: 'No file selected', description: 'Please select a photo to analyze.', variant: 'destructive'});
        return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await checkHygiene({ photoDataUri: previewUrl });
      setResult(aiResult);
    } catch (error) {
      console.error(error);
      toast({ title: 'Analysis Failed', description: 'Could not analyze the image. Please try again.', variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Hygiene Reporting</CardTitle>
        </div>
        <CardDescription>Upload a kitchen photo for AI-based hygiene analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input id="hygiene-photo" type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <div className="relative mt-4 h-48 w-full overflow-hidden rounded-md border">
            <Image src={previewUrl} alt="Hygiene Report Preview" layout="fill" objectFit="cover" data-ai-hint="kitchen hygiene"/>
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
        <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Analyzing...' : 'Analyze Photo'}
        </Button>
      </CardFooter>
    </Card>
  );
}
