import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/interfaces/NextPageWithLayout';


const Page: NextPageWithLayout = () => {
    return <p>hello world</p>
};

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            {page}
        </>
    )
};

export default Page;
