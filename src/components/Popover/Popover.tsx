import { offset, useId, type Placement } from '@floating-ui/react';
import {
  arrow,
  FloatingArrow,
  FloatingPortal,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions
} from '@floating-ui/react';
import {
  AnimatePresence,
  motion,
  type LegacyAnimationControls,
  type TargetAndTransition,
  type Transition,
  type VariantLabels
} from 'motion/react';
import { useRef, useState } from 'react';

interface PopoverProps {
  children: React.ReactNode;
  renderPopover: React.ReactNode;
  as?: React.ElementType;
  animateOptions?: {
    initial?: TargetAndTransition | VariantLabels | boolean;
    animate?: TargetAndTransition | VariantLabels | boolean | LegacyAnimationControls;
    exit?: TargetAndTransition | VariantLabels;
    transition?: Transition;
  };
  className?: string;
  initialOpen?: boolean;
  arrowPosition?: string | number | null;
  mainAxis?: number;
  crossAxis?: number;
  placement?: Placement;
}

const Popover = ({
  children,
  renderPopover,
  className,
  animateOptions,
  as: Element = 'div',
  initialOpen = false,
  arrowPosition = null,
  mainAxis = 0,
  crossAxis = 0,
  placement = 'bottom'
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const arrowRef = useRef(null);

  const id = useId();

  const defaultAnimateOptions = {
    initial: animateOptions?.initial || { opacity: 0, scale: 0, transformOrigin: 'top center' },
    animate: animateOptions?.animate || { opacity: 1, scale: 1, transformOrigin: 'top center' },
    exit: animateOptions?.exit || { opacity: 0, scale: 0, transformOrigin: 'top center' },
    transition: animateOptions?.transition || { duration: 0.2, ease: 'easeInOut' }
  };

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    middleware: [
      shift(),
      arrow({
        element: arrowRef
      }),
      offset({
        mainAxis: mainAxis,
        crossAxis: crossAxis
      })
    ]
  });

  const hover = useHover(context, {
    handleClose: safePolygon()
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <Element className={`${className}`} ref={refs.setReference} {...getReferenceProps()}>
      {children}
      <FloatingPortal id={id ? `popover-${id}` : undefined}>
        <AnimatePresence>
          {isOpen && (
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <motion.div
                initial={defaultAnimateOptions.initial}
                animate={defaultAnimateOptions.animate}
                exit={defaultAnimateOptions.exit}
                transition={defaultAnimateOptions.transition}
              >
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  fill='white'
                  staticOffset={arrowPosition ?? 0}
                  style={{
                    transform: 'translateY(-1px)',
                    zIndex: 1
                  }}
                />
                {renderPopover}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  );
};

export default Popover;
