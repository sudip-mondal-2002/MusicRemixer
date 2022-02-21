import React from 'react';
import {Navbar, Container, Nav,} from 'react-bootstrap'
const myNavbar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand href="#home">Remix</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#docs">API Documentation</Nav.Link>
                        <Nav.Link href="#theory">How it works</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="https://github.com/sudip-mondal-2002/MusicRemixer">GitHub</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default myNavbar;
