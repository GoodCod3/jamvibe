import type { ReactElement } from 'react';


type IRootLayout = {
    children: ReactElement | ReactElement[],
};

const RootLayout = ({ children }: IRootLayout) => {
    return (
        <>
            <div className="wrapper">
                <header>Header</header>
                <article>
                    <h1>Welcome</h1>
                    <p>Hi!</p>
                </article>
                <aside><ul><li>Sidebar</li></ul></aside>
                <footer>Footer</footer>
            </div>
        </>
    );
};


export default RootLayout;
