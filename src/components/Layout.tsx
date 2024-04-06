import type { ReactElement } from 'react';

type IRootLayout = {
    children: ReactElement | ReactElement[],
};

const RootLayout = ({ children }: IRootLayout) => {
    return (
        <>
            <h1>RootLayout</h1>
            {children}
        </>
    );
};


export default RootLayout;
