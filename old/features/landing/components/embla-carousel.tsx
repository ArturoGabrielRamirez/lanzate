import React, { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import { useDotButton } from './embla-carousel-dot-button'
import * as motion from "motion/react-client"
import Image from 'next/image'

const TWEEN_FACTOR_BASE = 0.52

type PropType = {
    slides: {
        title: string
        description: string
        image: string
    }[]
    options?: EmblaOptionsType
}

type EmblaCarouselType = UseEmblaCarouselType[1]

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max)

function useCarouselProgress(isActive: boolean, duration: number = 5000) {
    const [progress, setProgress] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive) {
            setProgress(0)
            const stepTime = 50 // Actualizar cada 50ms para suavidad
            const steps = duration / stepTime
            const increment = 100 / steps

            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + increment
                    if (newProgress >= 100) {
                        return 100
                    }
                    return newProgress
                })
            }, stepTime)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
            setProgress(0)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isActive, duration])

    return progress
}

function useAutoScroll(emblaApi: EmblaCarouselType | undefined, delay: number = 5000) {
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null)

    const resetAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current)
        }
    }, [])

    const startAutoScroll = useCallback(() => {
        if (!emblaApi) return

        resetAutoScroll()
        autoScrollRef.current = setTimeout(() => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext()
            } else {
                emblaApi.scrollTo(0) // Volver al inicio cuando llegue al final
            }
        }, delay)
    }, [emblaApi, delay, resetAutoScroll])

    useEffect(() => {
        if (!emblaApi) return

        startAutoScroll()
        emblaApi.on('scroll', startAutoScroll)
        emblaApi.on('pointerDown', resetAutoScroll)

        return () => {
            resetAutoScroll()
            emblaApi.off('scroll', startAutoScroll)
            emblaApi.off('pointerDown', resetAutoScroll)
        }
    }, [emblaApi, startAutoScroll, resetAutoScroll])

    return { resetAutoScroll, startAutoScroll }
}

function EmblaCarousel(props: PropType) {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const tweenFactor = useRef(0)
    const tweenNodes = useRef<HTMLElement[]>([])

    const { selectedIndex/* , onDotButtonClick  */ } =
        useDotButton(emblaApi, undefined)

    useAutoScroll(emblaApi, 5000)

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
        if (!emblaApi) return
        tweenNodes.current = emblaApi.slideNodes().map((slideNode: HTMLElement) => {
            return slideNode.querySelector('.embla__slide__content') as HTMLElement
        })
    }, [])

    const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
        if (!emblaApi) return
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, [])

    const tweenScale = useCallback((emblaApi: EmblaCarouselType, eventName?: string) => {
        if (!emblaApi) return
        const engine = emblaApi.internalEngine()
        const scrollProgress = emblaApi.scrollProgress()
        const slidesInView = emblaApi.slidesInView()
        const isScrollEvent = eventName === 'scroll'

        emblaApi.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
            let diffToTarget = scrollSnap - scrollProgress
            const slidesInSnap = engine.slideRegistry[snapIndex]

            slidesInSnap.forEach((slideIndex: number) => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem: any) => {
                        const target = loopItem.target()

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target)

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress)
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress)
                            }
                        }
                    })
                }

                const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
                const scale = numberWithinRange(tweenValue, 0.75, 1).toString()
                const opacity = numberWithinRange(tweenValue, 0.3, 1).toString()
                const tweenNode = tweenNodes.current[slideIndex]

                if (tweenNode?.style) {
                    tweenNode.style.transform = `scale3d(${scale}, ${scale}, 1)`
                    tweenNode.style.opacity = opacity
                }
            })
        })
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        setTweenNodes(emblaApi)
        setTweenFactor(emblaApi)
        tweenScale(emblaApi, undefined)

        emblaApi
            .on('reInit', setTweenNodes)
            .on('reInit', setTweenFactor)
            .on('reInit', tweenScale)
            .on('scroll', tweenScale)
            .on('slideFocus', tweenScale)
    }, [emblaApi, tweenScale, setTweenNodes, setTweenFactor])

    return (
        <div className="max-w-5xl mx-auto cursor-grab select-none active:cursor-grabbing">
            <div className="" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom -ml-6">
                    {slides.map((slide, index) => {
                        const isActive = index === selectedIndex
                        const progress = useCarouselProgress(isActive)

                        return (
                            <div
                                className="transform-gpu flex-none w-[100%] md:w-[70%] min-w-0 pl-6"
                                key={index}
                            >
                                <div className="embla__slide__content rounded-[1.8rem] text-6xl font-semibold flex items-center justify-center h-96 select-none will-change-transform backface-hidden">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ amount: 0.3 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="grid grid-cols-2 gap-2 w-full h-full"
                                    >
                                        <motion.div
                                            className="flex flex-col p-10 h-full rounded-md bg-primary text-primary-foreground gap-6"
                                            /* initial={{ x: -50, opacity: 0 }} */
                                            whileInView={{ x: 0, opacity: 1 }}
                                            viewport={{ amount: 0.3 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    className="flex items-center justify-center flex-shrink-0 text-xl font-bold rounded-full bg-accent text-accent-foreground overflow-hidden"
                                                    initial={{ width: 0, height: 0, opacity: 0 }}
                                                    animate={{
                                                        width: 56,
                                                        height: 56,
                                                        opacity: 1,
                                                        transition: {
                                                            delay: 0.4,
                                                            duration: 0.6,
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 20
                                                        }
                                                    }}
                                                    exit={{ width: 0, height: 0, opacity: 0 }}
                                                >
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: 1,
                                                            transition: { delay: 0.8, duration: 0.3 }
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {index + 1}
                                                    </motion.span>
                                                </motion.div>
                                            )}
                                            <motion.p
                                                className="text-xl font-semibold leading-tight"
                                                initial={{ y: 20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                viewport={{ amount: 0.3 }}
                                                transition={{ duration: 0.6, delay: 0.6 }}
                                            >
                                                <b className='block text-2xl md:text-3xl mb-2'>{slide.title}</b> {slide.description}
                                            </motion.p>

                                            {/* Progress bar que aparece solo cuando el slide está activo */}
                                            <div className="mt-auto w-full">
                                                <div className="h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-primary-foreground"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: isActive ? `${progress}%` : "0%" }}
                                                        transition={{
                                                            duration: 0.1,
                                                            ease: "linear"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                        <div className="relative rounded-md overflow-hidden">
                                            <motion.div
                                                className="relative h-full"
                                                animate={{
                                                    scale: isActive ? 1.5 : 1,
                                                    opacity: isActive ? 1 : 0.3,
                                                    transition: {
                                                        duration: isActive ? 7 : 0.3,
                                                        delay: isActive ? 0.3 : 0
                                                    }
                                                }}
                                            >
                                                <Image
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel