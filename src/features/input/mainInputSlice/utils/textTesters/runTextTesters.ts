import type { TextTester } from './testers'
import { limitMaxNumber } from './testers'

const ERROR_TAGS = {
  critical: '$',
  nonCritical: '#',
}

export enum TypesOfRenderValue {
  value,
  error,
  warning,
}

export type ValueToRenderType = { value: string; type: TypesOfRenderValue }[]

interface TextTestersRunner {
  (props: { prevValue: string; newValue: string; isTestModeStrict: boolean }):
    | {
        isCorrect: true
      }
    | {
        isCorrect: false
        error?: string
        valueToRender?: ValueToRenderType
      }
}

const ALL_TESTERS: TextTester[] = [limitMaxNumber]

const findErrors = (stringToTest: string) =>
  ALL_TESTERS.reduce(
    (
      resultObj: {
        valueWithErrors: string
        criticalErrorsCount: number
        firstFoundError: null | string
      },
      tester
    ) => {
      const errorTag = tester.isCritical
        ? ERROR_TAGS.critical
        : ERROR_TAGS.nonCritical

      resultObj.valueWithErrors = resultObj.valueWithErrors.replace(
        tester.regExp,
        (matchedValue) => {
          if (tester.isCritical) resultObj.criticalErrorsCount += 1
          resultObj.firstFoundError =
            resultObj.firstFoundError || tester.errorText

          return errorTag + matchedValue + errorTag
        }
      )

      return resultObj
    },
    {
      valueWithErrors: stringToTest,
      criticalErrorsCount: 0,
      firstFoundError: null,
    }
  )

const runTextTesters: TextTestersRunner = ({
  prevValue,
  newValue,
  isTestModeStrict,
}) => {
  const { valueWithErrors, criticalErrorsCount, firstFoundError } =
    findErrors(newValue)

  if (!firstFoundError) {
    return { isCorrect: true }
  }

  const { criticalErrorsCount: criticalErrorsInPrevValue } =
    findErrors(prevValue)

  if (isTestModeStrict && criticalErrorsCount > criticalErrorsInPrevValue) {
    return { isCorrect: false }
  }

  const valueToRender: ValueToRenderType =
    valueWithErrors.match(/(\$[^$]+\$)|(#[^#]+#)|[^#$]+/g)?.map((matched) => {
      if (matched[0] === ERROR_TAGS.critical) {
        return {
          value: matched.slice(1, -1),
          type: TypesOfRenderValue.error,
        }
      }

      if (matched[0] === ERROR_TAGS.nonCritical) {
        return {
          value: matched.slice(1, -1),
          type: TypesOfRenderValue.warning,
        }
      }

      return {
        value: matched,
        type: TypesOfRenderValue.value,
      }
    }) || []

  return { isCorrect: false, error: firstFoundError, valueToRender }
}

export default runTextTesters
