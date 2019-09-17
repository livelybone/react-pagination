import ReactInput, { InputElType } from '@livelybone/react-input'
import React from 'react'

const inputConfigDefault = {
  /**
   * 是否启用输入
   *
   * Is input enabled
   *
   * Default: true
   * */
  enable: true,
  /**
   * 输入框的 label 名称
   *
   * The text of label
   *
   * Default: 'Go to'
   * */
  text: 'Go to' as React.ReactNode,
}

const turnBtns = {
  pre: {
    /**
     * Default: '<'
     * */
    text: '<' as React.ReactNode,
  },
  next: {
    /**
     * Default: '>'
     * */
    text: '>' as React.ReactNode,
  },
}

/**
 * 是否显示数字按钮：HasPage - 显示，NoPage - 不显示
 *
 * Determine whether show the digital btn: HasPage - show, NoPage - hide
 * */
export enum RenderMode {
  /** Default */
  HasPage,
  NoPage,
}

export interface PaginationProps {
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

function mergeConfig<T extends {}>(defaultConf: T, conf?: Partial<T>): T {
  if (conf === undefined) return defaultConf
  return (Object.keys(defaultConf) as (keyof T)[]).reduce(
    (pre, key) => {
      const val = conf[key]
      pre[key] = (val !== undefined ? val : defaultConf[key]) as T[keyof T]
      return pre
    },
    {} as T,
  )
}

export interface PaginationState {
  $currentPageNumber: string
}

export default class ReactPagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  private timer: any = null

  constructor(props: PaginationProps) {
    super(props)
    this.state = {
      $currentPageNumber: (props.currentPageNumber || 1) + '',
    }
  }

  get renderMode() {
    return this.props.pageCount !== undefined
      ? RenderMode.HasPage
      : RenderMode.NoPage
  }

  get currentPageSize() {
    return this.props.currentPageSize || this.props.pageSize
  }

  get pageCount() {
    return this.props.pageCount || 0
  }

  get inputConfig() {
    return mergeConfig(inputConfigDefault, this.props.inputConfig)
  }

  get turnBtns() {
    return {
      pre: mergeConfig(
        turnBtns.pre,
        this.props.turnBtns && this.props.turnBtns.pre,
      ),
      next: mergeConfig(
        turnBtns.next,
        this.props.turnBtns && this.props.turnBtns.next,
      ),
    }
  }

  get maxPageBtn() {
    return this.props.maxPageBtn || 7
  }

  get currentPageNumber() {
    return +this.state.$currentPageNumber || this.props.currentPageNumber || 1
  }

  get pagesArr() {
    const { currentPageNumber } = this
    const { pageCount } = this.props

    if (!pageCount) return []

    const { maxPageBtn } = this
    if (pageCount <= maxPageBtn) {
      return [...Array(pageCount)].map((val, i) => i + 1)
    }
    if (currentPageNumber <= (maxPageBtn + 1) / 2) {
      return [...Array(maxPageBtn - 1)]
        .map((val, i) => (i === maxPageBtn - 2 ? '...' : i + 1))
        .concat([pageCount])
    }
    if (currentPageNumber >= pageCount - (maxPageBtn - 1) / 2) {
      return [1, '...'].concat(
        [...Array(maxPageBtn - 2)].map((val, i) => pageCount - i).reverse(),
      )
    }
    return [1, '...']
      .concat(
        [...Array(maxPageBtn - 4)].map(
          (val, i) =>
            currentPageNumber - Math.floor((maxPageBtn - 3) / 2) + i + 1,
        ),
      )
      .concat(['...', pageCount])
  }

  get disabled() {
    return {
      pre: this.currentPageNumber <= 1,
      next:
        this.renderMode === RenderMode.NoPage
          ? this.props.pageSize > this.currentPageSize
          : this.currentPageNumber >= this.pageCount,
    }
  }

  get hide() {
    if (this.renderMode === RenderMode.NoPage) return this.currentPageSize <= 0
    return this.pageCount <= 0
  }

  get debounceTime() {
    return this.props.debounceTime !== undefined ? this.props.debounceTime : 500
  }

  static getDerivedStateFroProps(
    props: PaginationProps,
    state: PaginationState,
  ) {
    const page = +state.$currentPageNumber
    console.log(props, state)
    if (page && props.currentPageNumber !== page) {
      return { $currentPageNumber: props.currentPageNumber + '' }
    }
    return null
  }

  onPageChange = (pageNumber: number | string) => {
    const $currentPageNumber = pageNumber + ''
    if (this.state.$currentPageNumber !== $currentPageNumber) {
      this.setState({ $currentPageNumber })

      const { onPageChange } = this.props
      if (onPageChange && pageNumber) {
        if (this.debounceTime) {
          clearTimeout(this.timer)
          this.timer = setTimeout(
            () => onPageChange(+pageNumber),
            this.debounceTime,
          )
        } else onPageChange(+pageNumber)
      }
    }
  }

  toPre = () => {
    this.onPageChange(Math.max(1, this.currentPageNumber - 1))
  }

  toNext = () => {
    if (this.renderMode !== RenderMode.NoPage)
      this.onPageChange(Math.min(this.pageCount, this.currentPageNumber + 1))
    else if (this.props.pageSize <= this.currentPageSize)
      this.onPageChange(this.currentPageNumber + 1)
  }

  preFormatter = (val: string) => {
    const page = val.replace(/[^\d]+/g, '')
    if (this.renderMode !== RenderMode.NoPage) {
      const p = +page
      return p <= 0 ? '' : p > this.pageCount ? this.pageCount + '' : page
    }
    return page
  }

  input = (ev: React.ChangeEvent<InputElType>) => {
    this.onPageChange(ev.target.value)
  }

  render() {
    const { inputConfig, hide, disabled, turnBtns, pagesArr } = this
    return (
      !hide && (
        <div className="pagination">
          {inputConfig.enable && (
            <>
              <span className="label">{inputConfig.text}</span>
              <ReactInput
                className="input"
                value={this.state.$currentPageNumber}
                preFormatter={this.preFormatter}
                onChange={this.input}
              />
            </>
          )}
          <div
            className={`page-btn ${disabled.pre ? 'disabled' : ''}`}
            onClick={this.toPre}
          >
            {turnBtns.pre.text}
          </div>
          {pagesArr.map((val, i) => (
            <div
              className={`page-btn ${
                this.currentPageNumber === +val ? 'active' : ''
              } ${!+val ? 'disabled' : ''}`}
              key={i}
              onClick={this.onPageChange.bind(this, +val)}
            >
              {val}
            </div>
          ))}
          <div
            className={`page-btn ${disabled.next ? 'disabled' : ''}`}
            onClick={this.toNext}
          >
            {turnBtns.next.text}
          </div>
        </div>
      )
    )
  }
}
