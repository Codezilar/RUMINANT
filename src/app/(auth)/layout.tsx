import { ReactNode } from "react"

const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='auth'>
      <div className="auth-container">
        <div className="auth-top">
          <span className="theme-gradient">Kingadox Bank</span>  
          <p>Secure digital banking platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default RootLayout