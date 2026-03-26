import { AppLayoutProps } from '../AppLayout.d';

function PrivateLayout({ children }: Readonly<AppLayoutProps>): JSX.Element {
  return (
    <>
      {children}
      {/* <Footer /> */}
    </>
  );
}

export default PrivateLayout;
