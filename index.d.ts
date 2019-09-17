import { InputElType } from '@livelybone/react-input'
import React from 'react'

declare const inputConfigDefault: {
  /**
   * 是否启用输入
   *
   * Is input enabled
   *
   * Default: true
   * */
  enable: boolean
  /**
   * 输入框的 label 名称
   *
   * The text of label
   *
   * Default: 'Go to'
   * */
  text: React.ReactNode
}
declare const turnBtns: {
  pre: {
    /**
     * Default: '<'
     * */
    text: React.ReactNode
  }
  next: {
    /**
     * Default: '>'
     * */
    text: React.ReactNode
  }
}

/**
 * 是否显示数字按钮：HasPage - 显示，NoPage - 不显示
 *
 * Determine whether show the digital btn: HasPage - show, NoPage - hide
 * */
declare enum RenderMode {
  /** Default */
  HasPage = 0,
  NoPage = 1,
}

interface PaginationProps {
  pageSize: number
  /**
   * Start with 1: >= 1
   * */
  currentPageNumber?: number
  /**
   * 如果 pageCount === undefined，组件将使用 NoPage 模式渲染
   *
   * If this prop is undefined, the component will render in NoPage mode
   * */
  pageCount?: number
  /**
   * 当前页的实际大小，这将决定在 NoPage 模式下的跳转下一页的按钮是否可用
   *
   * The actual size of the current page, determines whether the next btn is disabled by compare with pageSize in NoPage mode
   *
   * Default: props.pageSize
   * */
  currentPageSize?: number
  /**
   * 数字按钮的最大数量
   *
   * The max number of digital buttons
   *
   * Default: 7
   * */
  maxPageBtn?: number
  /**
   * 页码跳转输入框的配置
   *
   * Config of input
   *
   * Default: inputConfigDefault
   * */
  inputConfig?: Partial<typeof inputConfigDefault>
  /**
   * 前进后退按钮的配置
   *
   * Config of pre/next buttons
   *
   * Default: turnBtns
   * */
  turnBtns?: Partial<typeof turnBtns>
  /**
   * 防抖时间，如果为 0，防抖功能将关闭
   *
   * Debounce time. If it is 0, the debounce action will be disabled
   *
   * Default: 500
   * */
  debounceTime?: number

  /**
   * Called when the page changed
   * */
  onPageChange?(pageNumber: number): void
}

interface PaginationState {
  $currentPageNumber: string
}

declare class ReactPagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  private timer

  constructor(props: PaginationProps)

  readonly renderMode: RenderMode
  readonly currentPageSize: number
  readonly pageCount: number
  readonly inputConfig: {
    /**
     * 是否启用输入
     *
     * Is input enabled
     *
     * Default: true
     * */
    enable: boolean
    /**
     * 输入框的 label 名称
     *
     * The text of label
     *
     * Default: 'Go to'
     * */
    text: React.ReactNode
  }
  readonly turnBtns: {
    pre: {
      /**
       * Default: '<'
       * */
      text: React.ReactNode
    }
    next: {
      /**
       * Default: '>'
       * */
      text: React.ReactNode
    }
  }
  readonly maxPageBtn: number
  readonly currentPageNumber: number
  readonly pagesArr: React.ReactText[]
  readonly disabled: {
    pre: boolean
    next: boolean
  }
  readonly hide: boolean
  readonly debounceTime: number

  static getDerivedStateFroProps(
    props: PaginationProps,
    state: PaginationState,
  ): {
    $currentPageNumber: string
  } | null

  onPageChange: (pageNumber: React.ReactText) => void
  toPre: () => void
  toNext: () => void
  preFormatter: (val: string) => string
  input: (ev: React.ChangeEvent<InputElType>) => void

  render(): false | JSX.Element
}

export default ReactPagination
export { PaginationProps, PaginationState, RenderMode }
