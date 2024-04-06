import type { ReactElement } from 'react';


type IRootLayout = {
    children: ReactElement | ReactElement[],
};

const RootLayout = ({ children }: IRootLayout) => {
    return (
        <>
            <header></header>
            {children}
        </>
    );
};


export default RootLayout;
