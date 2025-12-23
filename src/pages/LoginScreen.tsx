import React from 'react';

import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('luizcf14@gmail.com');
  const [password, setPassword] = React.useState('qazx74123');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Here you would typically save the token/user info
        console.log('Login successful:', data.user);
        console.log('Login successful:', data.user);
        onLogin(data.user);
      } else {
        setError(data.message || 'Falha no login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-6 md:p-12 font-mono">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div className="flex flex-col items-center text-center mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-[32px]">spa</span>
          </div>
          <h1 className="text-text-main text-2xl font-bold leading-tight tracking-normal">
            Acesso do Profissional
          </h1>
          <p className="text-text-muted text-base font-normal leading-normal pt-2">
            Insira suas credenciais para continuar.
          </p>
        </div>

        <form className="flex flex-col gap-5 mt-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-text-main text-sm font-medium leading-normal" htmlFor="username">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <input
                className="flex w-full rounded-lg border border-border-light bg-white text-text-main focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 pl-11 pr-4 text-base font-normal placeholder:text-text-muted/70 transition-colors"
                id="username"
                placeholder="ex: doutor@bahse.com"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-text-muted">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-text-main text-sm font-medium leading-normal" htmlFor="password">
                Senha
              </label>
              <a className="text-primary text-sm font-medium hover:underline hover:text-primary/80 transition-colors" href="#">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative group">
              <input
                className="flex w-full rounded-lg border border-border-light bg-white text-text-main focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 pl-11 pr-11 text-base font-normal placeholder:text-text-muted/70 transition-colors"
                id="password"
                placeholder="Insira sua senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-text-muted group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <button className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-white"
              id="remember"
              type="checkbox"
            />
            <label className="text-sm text-text-muted select-none cursor-pointer" htmlFor="remember">
              Lembrar-me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-normal shadow-sm transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
            ) : (
              <>
                <span className="truncate">ENTRAR</span>
                <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-4 items-center border-t border-border-light pt-6">
          <p className="text-text-muted text-sm">
            Ainda não tem acesso? <a className="text-text-main font-medium hover:text-primary transition-colors" href="#">Solicitar cadastro</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
