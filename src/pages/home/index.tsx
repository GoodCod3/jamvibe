import type { NextPageWithLayout } from '@/interfaces/NextPageWithLayout';
import { getLayout } from '@/app/render';


const App: NextPageWithLayout = () => {
    return <p>hello world</p>
};

App.getLayout = getLayout;

export default App;
