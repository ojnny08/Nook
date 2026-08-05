import { Box } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/Button";

const NavBar = () => {
    const [usename, setUsername] = useState('')
    const [isSignedIn, setIsSignedIn] = useState(false)

    const handleAuth = async () => {
        setIsSignedIn(true)
        setUsername('Jonny')
    }
    const handleLogout = async () => {

    }
    return (
        <header className='navbar'>
            <nav className='inner'>
                <div className="left">
                    <div className='brand'>
                        <Box className="logo"/>
                        <span className="name">Nook</span>
                    </div>

                    <ul className="links">
                        <li><a href="#">Products</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Community</a></li>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greetings">
                                {usename ? `Hi ${usename}` : "Sign in"}
                            </span>

                            <Button className="sm" onClick={handleLogout}> Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button className="sm" variant="ghost" onClick={handleAuth}>
                                Login
                            </Button>
                            <a href="#" className="cta">Get started</a>
                        </>
                    )}
                    
                    
                </div>
            </nav>
        </header>
    )
}

export default NavBar
