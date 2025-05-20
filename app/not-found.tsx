// pages/404.js
export default function Custom404() {
  return (
    <div className="bg-[#ebc260]" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 1rem'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Ops! A página que você procura não foi encontrada.
      </p>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
        Voltar para a página inicial
      </a>
    </div>
  );
}
