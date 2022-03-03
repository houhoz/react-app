import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Animated } from 'react-animated-css'
import type { AnimationString } from 'react-animated-css'

interface IProps {
  visible: boolean
  animationIn?: AnimationString
  animationOut?: AnimationString
  children: React.ReactNode
  animationOutDuration?: number
  disappearOffset?: number
  animationInDuration?: number
  className?: any
}

function AnimatedVisibility({
  visible,
  children,
  animationOutDuration,
  disappearOffset,
  animationIn,
  animationOut,
  animationInDuration,
  className,
  ...rest
}: IProps) {
  const [noDisplay, setNoDisplay] = useState(!visible)
  useEffect(() => {
    if (!visible) {
      if (animationOutDuration && disappearOffset) {
        const delay = animationOutDuration - disappearOffset
        setTimeout(() => setNoDisplay(true), delay)
      }
    } else setNoDisplay(false)
  }, [visible])

  const style = noDisplay ? { display: 'none' } : {}
  return (
    <Animated
      animationIn={animationIn ? animationIn : 'bounce'}
      animationOut={animationOut ? animationOut : 'bounce'}
      isVisible={visible}
      style={style}
      {...rest}
    >
      {children}
    </Animated>
  )
}

AnimatedVisibility.defaultProps = {
  animationOutDuration: 1000,
  disappearOffset: 350,
  visible: true,
}

AnimatedVisibility.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  animationOutDuration: PropTypes.number,
  disappearOffset: PropTypes.number,
  visible: PropTypes.bool,
}

type AnyComponent<P = any> =
  | (new (props: P) => React.Component)
  | ((
      props: P & { children?: React.ReactNode }
    ) => React.ReactElement<any> | null)

function makeAnimated(
  Component: AnyComponent,
  animationIn: AnimationString,
  animationOut: AnimationString,
  animationInDuration: number,
  animationOutDuration: number,
  disappearOffset: number
) {
  return function ({
    open,
    className,
    ...props
  }: {
    open: boolean
    className?: any
  }) {
    return (
      <AnimatedVisibility
        visible={open}
        animationIn={animationIn}
        animationOut={animationOut}
        animationInDuration={animationInDuration}
        animationOutDuration={animationOutDuration}
        disappearOffset={disappearOffset}
        className={className}
      >
        <Component {...props} />
      </AnimatedVisibility>
    )
  }
}

export function makeAnimationSlideLeft(Component: AnyComponent) {
  return makeAnimated(Component, 'slideInLeft', 'slideOutLeft', 400, 500, 200)
}

export function makeAnimationSlideUpDown(Component: AnyComponent) {
  return makeAnimated(Component, 'slideInDown', 'slideOutUp', 400, 500, 200)
}

export default AnimatedVisibility
