import type { NextPageWithLayout } from '@/interfaces/NextPageWithLayout';
import RootLayout from '@/components/Layout';


const Home: NextPageWithLayout = () => {
    return (
        <RootLayout>
            <h1>HOME</h1>
        </RootLayout>
    );
};

export default Home;
