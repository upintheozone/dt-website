import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Inter } from "next/font/google"
import styles from '@/styles/Timer.module.css'
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const inter = Inter({
  subsets: ['latin'] ,
  variable: '--inter-font',
})

export default function Timer() {

  // Getting task information based on UUID

  const router = useRouter();
  const [task, setTask] = useState(null);
  const [cookies, setCookies] = useCookies(['todos']);
  const taskId = router.query.id;

  // Compare task id with tasks
  useEffect(() => {
    if (cookies.todos) {
      const task = cookies.todos.find(task => task.id === taskId);
      setTask(task);
    }
  }, [cookies, taskId]);

  // useState for different timer functions
  const [timeLeft, setTimeLeft] = useState(1500); // 1500 seconds = 25 minutes
  const [timerRunning, setTimerRunning] = useState(true);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [showDonePopup, setShowDonePopup] = useState(false);

  // Count down
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);
    

  // --- Different functions for pause, continue, and end ---

  const handlePause = () => {
    setTimerRunning(false);
  };
  
  const handleContinue = () => {
    setTimerRunning(true);
  };
  
  const handleEnd = () => {
    setShowEndPopup(true)
    setTimerRunning(false);
  };
  
  const handleConfirmEnd = () => {
    setShowEndPopup(false);
    setTimeLeft(0);
    setTimerRunning(false);
  };

  const handleConfirmContinue = () =>{
    setShowEndPopup(false);
    setTimerRunning(true);
  }

  const handleContinueTask = () => {
    setShowDonePopup(false);
    setTimeLeft(1500);
    setTimerRunning(true);
  };
  
  const handleConfirmDone = () => {
    setShowDonePopup(false);
    setTimerRunning(false);
    const updatedTodos = cookies.todos.filter(t => t.id !== taskId);
    setCookies('todos', updatedTodos);
    router.push('/');
  };

  const handleConfirmExit = () => {
    setShowDonePopup(false);
    setTimerRunning(false);
    router.back();
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // End timer at 0s left
  useEffect(() => {
    if (timeLeft === 0) {
      setShowDonePopup(true);
      setTimerRunning(false);
    }
  }, [timeLeft]);

  // Seperate component to ensure no errors while rendering "undefined"
  const renderCurrentTask = () => {
    if (!task) {
      return <div style={{textAlign:"center"}}><br /><br /><br /><br /><br />Loading...</div>;
    }
    return (
      <>
        <h3 className={styles.timerCurrent}>Focusing on: {task.name}</h3>
      </>
    );
  };

  // --- JSX code ---

  return (
    <>
      <Head>
        <title>Timer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
        <div className={inter.variable}>
          <img src="/iPhone 13 - Starlight.png" className={styles.phoneBezel} />
          <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.timerToast}>Keep up the good work!</h3>
            </div>

            <div className={styles.timerTime}>
              <h1 className={styles.timerRemaining}>{formatTime(timeLeft)}</h1>
            </div>

            <div className={styles.timerOptions}>
                {renderCurrentTask()}
              {timerRunning ? (
                <div onClick={handlePause} className={styles.timerPause}>
                  <h3 className={styles.timerText}>Pause Timer</h3>
                </div>
              ) : (
                <div onClick={handleContinue} className={styles.timerContinue}>
                  <h3 className={styles.timerText}>Continue Timer</h3>
                </div>
                )}
              <div onClick={handleEnd} className={styles.timerEnd}>
                <h3 className={styles.timerText}>End</h3>
              </div>
            </div>

            {showEndPopup && (
              <div className={styles.confirm}>
                <h3 className={styles.confirmText}>Are you sure you want to end?</h3>
                <button className={styles.confirmButton} onClick={handleConfirmEnd}>Yes</button>
                <button className={styles.confirmButton} onClick={handleConfirmContinue}>Cancel</button>
              </div>
            )}
            {showDonePopup && (
              <div className={styles.confirmDone}>
                <h3 className={styles.confirmText}>Task fully completed?</h3>
                <button className={styles.confirmButton} onClick={handleConfirmDone}>Yes</button>
                <button className={styles.confirmButton} onClick={handleContinueTask}>+25 mins</button>
                <button className={styles.confirmButtonExit} onClick={handleConfirmExit}>Exit for now</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
