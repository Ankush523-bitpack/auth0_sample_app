'use  client';

import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0/client';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import PageLink from './PageLink';
import AnchorLink from './AnchorLink';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const toggle = () => setIsOpen(!isOpen);

  const [username, setUsername] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getQueryParam = param => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };

    const loggedInUsername = Cookie.get('username') || getQueryParam('username');
    const walletAddr = Cookie.get('walletAddress') || getQueryParam('walletAddress');

    if (loggedInUsername && walletAddr) {
      setUsername(loggedInUsername);
      setWalletAddress(walletAddr);
      Cookie.set('username', loggedInUsername);
      Cookie.set('walletAddress', walletAddr);
    }
  }, [router.query]);

  const handleLogin = () => {
    window.location.href = `https://bitpack-webauthn-client.vercel.app?redirectUrl=${window.location.origin}`;
  };

  const handleLogout = () => {
    Cookie.remove('username');
    Cookie.remove('walletAddress');
    setUsername(null);
    setWalletAddress(null);
    window.location.href = window.location.origin;
  };

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar color="light" light expand="md">
        <Container>
          <NavbarBrand className="logo" />
          <NavbarToggler onClick={toggle} data-testid="navbar-toggle" />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar data-testid="navbar-items">
              <NavItem>
                <PageLink href="/" className="nav-link" testId="navbar-home">
                  Home
                </PageLink>
              </NavItem>
              {user && (
                <>
                  <NavItem>
                    <PageLink href="/csr" className="nav-link" testId="navbar-csr">
                      Client-side rendered page
                    </PageLink>
                  </NavItem>
                  <NavItem>
                    <PageLink href="/ssr" className="nav-link" testId="navbar-ssr">
                      Server-side rendered page
                    </PageLink>
                  </NavItem>
                  <NavItem>
                    <PageLink href="/external" className="nav-link" testId="navbar-external">
                      External API
                    </PageLink>
                  </NavItem>
                </>
              )}
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isLoading && !user && (
                <NavItem id="qsLoginBtn">
                  <AnchorLink
                    href="/api/auth/login"
                    className="btn btn-primary btn-margin"
                    tabIndex={0}
                    testId="navbar-login-desktop">
                    Sign in
                  </AnchorLink>
                </NavItem>
              )}
              <br/>
              {username && walletAddress ? (
                <Nav className="ml-auto" navbar>
                  <NavItem className="mr-3">
                    <span className="text-muted">Username:</span> <strong>{username}</strong>
                  </NavItem>
                  <NavItem className="mr-3">
                    <span className="text-muted">Wallet Address:</span> <strong>{walletAddress}</strong>
                  </NavItem>
                  <NavItem>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </NavItem>
                </Nav>
              ) : (
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <button className="btn btn-primary btn-margin" onClick={handleLogin}>
                      Passkey Login
                    </button>
                  </NavItem>
                </Nav>
              )}

              {user && (
                <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-desktop"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header data-testid="navbar-user-desktop">
                      {user.name}
                    </DropdownItem>
                    <DropdownItem className="dropdown-profile" tag="span">
                      <PageLink href="/profile" icon="user" testId="navbar-profile-desktop">
                        Profile
                      </PageLink>
                    </DropdownItem>
                    <DropdownItem id="qsLogoutBtn">
                      <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                        Log out
                      </AnchorLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isLoading && !user && (
              <Nav className="d-md-none" navbar>
                <AnchorLink
                  href="/api/auth/login"
                  className="btn btn-primary btn-block"
                  tabIndex={0}
                  testId="navbar-login-mobile">
                  Log in
                </AnchorLink>
              </Nav>
            )}
            {user && (
              <Nav
                id="nav-mobile"
                className="d-md-none justify-content-between"
                navbar
                data-testid="navbar-menu-mobile">
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-mobile"
                    />
                    <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                      {user.name}
                    </h6>
                  </span>
                </NavItem>
                <NavItem>
                  <PageLink href="/profile" icon="user" testId="navbar-profile-mobile">
                    Profile
                  </PageLink>
                </NavItem>
                <NavItem id="qsLogoutBtn">
                  <AnchorLink
                    href="/api/auth/logout"
                    className="btn btn-link p-0"
                    icon="power-off"
                    testId="navbar-logout-mobile">
                    Log out
                  </AnchorLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
