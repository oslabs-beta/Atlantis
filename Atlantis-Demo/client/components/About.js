import React from 'react'

//import coins from '../coins.svg';


const About = () => {
   
    return(
   
            <div className="about">
                <div className="overCoins">
                <hr/>
                <h2>Wallet</h2>

                <p>Wallet is a digital budget balancer designed to help keep your monthly finances on track. 
                    It's easier to make fiscally responsible choices when you have all the facts. Let's get the "big picture" 
                    and start seeing where your money moves.</p>
                    <hr/>
                </div>
                <div className="coins"> 
                {/* <img src={coins}  alt="coins" /> */}
                </div>
            </div>
    )       
} 
export default About;


// state = {
//     minutes: 1,
//     seconds: 0,
// }

// componentDidMount() {
//     this.myInterval = setInterval(() => {
//         const { seconds, minutes } = this.state

//         if (seconds > 0) {
//             this.setState(({ seconds }) => ({
//                 seconds: seconds - 1
//             }))
//         }
//         if (seconds === 0) {
//             if (minutes === 0) {
//                 clearInterval(this.myInterval)
//             } else {
//                 this.setState(({ minutes }) => ({
//                     minutes: minutes - 1,
//                     seconds: 59
//                 }))
//             }
//         } 
//     }, 1000)
// }

// componentWillUnmount() {
//     clearInterval(this.myInterval)
// }

// render() {
//     const { minutes, seconds } = this.state
//     return (
//         <div className="timer" >
           
//             <h2>Daily Breathing Exercise</h2>
           

//             { minutes === 0 && seconds === 0
//                 ? <h1 > Completed Great Work! </h1>
//                 : <h2> Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds} </h2>
//             }
//              <p>Each rotation is an Inhale and Exhale</p>
//               <h3>Breathe In </h3>
//               <p> ∇ </p>
//             <div>

//               <img src={loader} className="loader" alt="loader" />
//               <p> Δ </p>
//                <p> When timer gap reaches this point exhale</p>
//                <iframe src="https://open.spotify.com/embed/playlist/0UvwJlHhpzYaKgLoPynziu?si=GK2ULz2_RRabsK57sdRoDA" width="300" height="75" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
             
//             </div>
//               {/* <iframe src="https://i.gifer.com/3juk.gif" width="480" height="480" frameBorder="0" allowFullScreen></iframe> */}


//         </div>
//     )
// }