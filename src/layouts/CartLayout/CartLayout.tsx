import { Outlet } from 'react-router-dom';

import Footer from '~/components/Footer';
import CartHeader from '~/components/CartHeader';

interface CartLayoutProps {
  children?: React.ReactNode;
}

const CartLayout = ({ children }: CartLayoutProps) => {
  return (
    <div>
      <CartHeader />
      {children}
      <Outlet />
      <Footer />
    </div>
  );
};

export default CartLayout;
