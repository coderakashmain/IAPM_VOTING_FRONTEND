import { lazy, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import IndexRouter from './Router/IndexRouter'
import PrivateRouter from './Router/PrivateRouter'
import { Suspense } from 'react'
import Loader from './Components/Fallback/Loader'





const VotePage = lazy(()=> import('./Pages/VotePage'))
const DefaultPage = lazy(()=> import('./Pages/DefaultPage'))
const PostDetails = lazy(()=> import('./Components/PostDetails'))
const Home = lazy(()=> import('./Pages/Home'))

function App() {

 const router = createBrowserRouter([
  {
    path : '/',
    element : <><IndexRouter/></>,
    children : [
      {
        path : '',
        element : <><Suspense fallback={<Loader/>}><Home/></Suspense></>,
        children : [
          {
            path : '',
            element : <><DefaultPage/></>
          },
          {
            path : '/:postname',
            element : <><PostDetails/></>
          }
        ]
      },
      {
        path : '/voting',
        element : <><PrivateRouter/></>,
        children : [
          {
            path : '',
            element : <><VotePage/></>
          }
        ]
      }
    ]
  }
 ])


  return (
    <RouterProvider router={router}/>
  )
}

export default App
