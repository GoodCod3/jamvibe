import type { ReactElement } from 'react';

import RootPage from './rootPage';


export const getLayout = (page: ReactElement) => {
    return (
        <RootPage>
            {page}
        </RootPage>
    )
};