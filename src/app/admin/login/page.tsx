"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'Giriş başarısız')
      }
    } catch (error) {
      setError('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .geometric-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483, #7209b7);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .geometric-shape {
          position: absolute;
          opacity: 0.1;
        }
        
        .circle {
          border-radius: 50%;
          background: rgba(139, 69, 19, 0.3);
        }
        
        .triangle {
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 43px solid rgba(255, 215, 0, 0.2);
        }
        
        .square {
          background: rgba(75, 0, 130, 0.3);
          transform: rotate(45deg);
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        zIndex: 9999,
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div className="geometric-bg"></div>
        
        {/* Geometric Shapes */}
        <div className="geometric-shape circle" style={{
          width: '100px',
          height: '100px',
          top: '10%',
          left: '15%',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div className="geometric-shape triangle" style={{
          top: '20%',
          right: '20%',
          animation: 'rotate 20s linear infinite'
        }}></div>
        
        <div className="geometric-shape square" style={{
          width: '60px',
          height: '60px',
          bottom: '25%',
          left: '10%',
          animation: 'pulse 6s ease-in-out infinite'
        }}></div>
        
        <div className="geometric-shape circle" style={{
          width: '80px',
          height: '80px',
          bottom: '15%',
          right: '15%',
          animation: 'rotate 15s linear infinite reverse'
        }}></div>
        
        <div className="geometric-shape square" style={{
          width: '40px',
          height: '40px',
          top: '60%',
          right: '30%',
          animation: 'pulse 8s ease-in-out infinite'
        }}></div>
        
        {/* Main Login Card */}
        <div style={{
          background: 'rgba(30, 30, 50, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '3rem 2.5rem',
          width: '100%',
          maxWidth: '450px',
          margin: '20px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          animation: 'slideUp 0.8s ease-out',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Card Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7209b7, #533483, #0f3460)',
            borderRadius: '30px 30px 0 0'
          }}></div>
          
          {/* Logo Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #7209b7, #533483)',
              borderRadius: '25px',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(114, 9, 183, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'pulse 3s ease-in-out infinite'
            }}>
              {/* Logo Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                animation: 'rotate 10s linear infinite'
              }}></div>
              
              {/* ZP Logo */}
              <span style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                zIndex: 1
              }}>
                ZP
              </span>
            </div>
            
            <h1 style={{
              color: '#ffffff',
              fontSize: '2.2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              WebkitBackgroundClip: 'text',
            }}>
              ZentProje
            </h1>
            
            <p style={{
              color: '#a0a0b0',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Yönetici Paneli Erişimi
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.3))',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <span style={{
                  color: '#ff6b6b',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  ⚠️ {error}
                </span>
              </div>
            )}
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                color: '#e0e0e0',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin şifresini girin"
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(114, 9, 183, 0.6)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(114, 9, 183, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !password}
              style={{
                width: '100%',
                padding: '1.2rem',
                background: isLoading 
                  ? 'linear-gradient(135deg, #4a5568, #718096)' 
                  : 'linear-gradient(135deg, #7209b7, #533483)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading 
                  ? 'none' 
                  : '0 10px 30px rgba(114, 9, 183, 0.4)',
                transform: isLoading ? 'none' : 'translateY(0)',
                opacity: isLoading ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 15px 40px rgba(114, 9, 183, 0.6)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 10px 30px rgba(114, 9, 183, 0.4)'
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'rotate 1s linear infinite'
                  }}></div>
                  Giriş yapılıyor...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Giriş Yap
                </span>
              )}
            </button>
          </form>
          
          <div style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              color: '#a0aec0',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
               Güvenli kimlik doğrulama gereklidir
            </p>
          </div>
        </div>
      </div>
    </>
  )
}