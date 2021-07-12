import useStyles from 'styles'
import ExpressionInput from './features/input/ExpressionInput'
import Keyboard from './features/input/Keyboard'

import type { FC } from 'react'

const App: FC = () => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <div className={styles.expressionInput}>
        <ExpressionInput />
      </div>

      <div className={styles.keyboard}>
        <Keyboard />
      </div>
    </div>
  )
}

export default App
