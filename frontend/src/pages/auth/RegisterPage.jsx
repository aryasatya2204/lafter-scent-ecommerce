import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-accent">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">Register</h1>
        <p className="text-gray-500 mb-6">Fitur pendaftaran sedang dalam pengembangan.</p>
        <Button onClick={() => navigate('/login')} fullWidth>
          Kembali ke Login
        </Button>
      </div>
    </div>
  );
}