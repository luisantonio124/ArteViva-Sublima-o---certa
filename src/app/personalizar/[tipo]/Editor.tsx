'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface EditorProps {
  product: any;
}

export default function Editor({ product }: EditorProps) {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      alert('Use PNG ou JPG até 10MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddToCart = async () => {
    const formData = new FormData();
    formData.append('variationId', product.variations[0].id);
    formData.append('text', text);
    formData.append('textColor', textColor);
    formData.append('fontFamily', fontFamily);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    await fetch('/api/cart', { method: 'POST', body: formData });
    alert('Personalização salva no carrinho!');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-80 h-80 border">
          {product.imageUrl && (
            <Image src={product.imageUrl} alt={product.name} fill sizes="320px" className="object-cover" />
          )}
          {imagePreview && (
            <Image src={imagePreview} alt="Preview" fill sizes="320px" className="object-contain" />
          )}
          {text && (
            <span className="absolute top-2 left-2" style={{ color: textColor, fontFamily }}>
              {text}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <label className="block mb-1">Imagem</label>
            <input type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
          </div>
          <div>
            <label className="block mb-1">Texto</label>
            <input value={text} onChange={(e) => setText(e.target.value)} className="border p-1 w-full" />
          </div>
          <div>
            <label className="block mb-1">Cor do texto</label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">Fonte</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="border p-1">
              <option value="Arial">Arial</option>
              <option value="'Times New Roman'">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          <Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
        </div>
      </div>
    </div>
  );
}
