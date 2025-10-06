import { lazy, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import IndexRouter from './Router/IndexRouter'
import PrivateRouter from './Router/PrivateRouter'
import Loader from './Components/Fallback/Loader'
import LoginPrivateRouter from './Router/LoginPrivateRouter'
import VerifyOTP from './Pages/verifyOTP'
import { ElectionProvider } from './Context/ElectionProvider'

const PageNotFound = lazy(() => import('./Pages/PageNotFound'))
const SelectOtpMethod = lazy(() => import('./Components/SelectOtpMethod'))
const Login = lazy(() => import('./Pages/Login'))
const VotePage = lazy(() => import('./Pages/VotePage'))
const DefaultPage = lazy(() => import('./Pages/DefaultPage'))
const PostDetails = lazy(() => import('./Components/PostDetails'))
const Home = lazy(() => import('./Pages/Home'))

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ElectionProvider>
          <IndexRouter />
        </ElectionProvider>
      ),
      children: [
        {
          path: '',
          element: (
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          ),
          children: [
            {
              path: '',
              element: <DefaultPage />,
            },
            {
              path: 'postdetails/:postname', 
              element: (
                <Suspense fallback={<Loader />}>
                  <PostDetails />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: 'login', 
          element: (
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: 'login/verification', 
          element: <LoginPrivateRouter />,
          children: [
            {
              path: '',
              element: (
                <Suspense fallback={<Loader />}>
                  <SelectOtpMethod />
                </Suspense>
              ),
            },
            {
              path: 'verifyOTP',
              element: (
                <Suspense fallback={<Loader />}>
                  <VerifyOTP />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: 'voting', 
          element: <PrivateRouter />,
          children: [
            {
              path: '',
              element: (
                <Suspense fallback={<Loader />}>
                  <VotePage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: '*', 
          element: (
            <Suspense fallback={<Loader />}>
              <PageNotFound />
            </Suspense>
          ),
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
