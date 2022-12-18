import React, { Suspense, lazy } from "react"
// import Test from "./components/Test"
// import Home from "./components/Home"
import { Link, Route, Routes } from "react-router-dom"

// 路由懒加载
const Test = lazy(() => import(/* wenpackChunkName: 'test' */"./components/Test"))
const Home = lazy(() => import(/* wenpackChunkName: 'home' */"./components/Home"))

const App = () => {
    return <>
        <h1>App</h1>
        <ul>
            <li>
                <Link to={"/test"}>Test</Link>
            </li>
            <li>
                <Link to={"/home"}>Home</Link>
            </li>
        </ul>
        <Suspense fallback={<div>loading...</div>}>
            <Routes>
                <Route path="/test" element={<Test/>}></Route>
                <Route path="/home" element={<Home/>}></Route>
            </Routes>
        </Suspense>
    </>
}

export default App