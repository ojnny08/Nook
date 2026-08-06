import { Box } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
    const { isSignedIn, username, signIn, signOut} = useAuth()

    const handleAuth = async () => {
        try {
            if (isSignedIn) {
                await signOut();
            }
        } catch (error) {
            return (
                <div className="signOut-failed">
                    Signout Failed
                </div>
            )
            return;
        }

        try {
            if (!isSignedIn) {
                await signIn();
            }
        } catch (error) {
            console.error(`sign in faild ${error}`)
        }
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
                            <span className="greeting">
                                {username ? `Hi ${username}` : "Sign in"}
                            </span>

                            <Button size="sm" onClick={handleAuth}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="ghost" onClick={handleAuth}>
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
