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
  pageIndex?: number
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
   * Value range: >= 5
   * If it is 0, the component will render with the NoPage render mode
   * Else if it < 5, the value will be reset to 5
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
      $currentPageNumber: (props.pageIndex || 1) + '',
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
    return this.props.maxPageBtn && this.props.maxPageBtn >= 5
      ? this.props.maxPageBtn
      : 5
  }

  get currentPageNumber() {
    return +this.state.$currentPageNumber || this.props.pageIndex || 1
  }

  get pagesArr() {
    const { currentPageNumber } = this
    const { pageCount } = this.props
    const { maxPageBtn } = this

    if (!pageCount || this.props.maxPageBtn === 0) return []

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

  setPageNumber = (
    pageNumber: number | string,
    triggerChange: boolean | ((page: number) => boolean) = false,
  ) => {
    const page = Math.min(Math.max(1, +pageNumber), this.pageCount || Infinity)
    if (!isNaN(page)) {
      const $currentPageNumber = page + ''
      if (this.state.$currentPageNumber !== $currentPageNumber) {
        if ($currentPageNumber) this.setState({ $currentPageNumber })

        if (
          (typeof triggerChange === 'function'
            ? triggerChange(page)
            : triggerChange) ||
          page !== +pageNumber
        ) {
          const { onPageChange } = this.props
          if (onPageChange && page) {
            if (this.debounceTime) {
              clearTimeout(this.timer)
              this.timer = setTimeout(
                () => onPageChange(page),
                this.debounceTime,
              )
            } else onPageChange(page)
          }
        }
      }
    }
  }

  toPre = () => {
    this.setPageNumber(this.currentPageNumber - 1, true)
  }

  toNext = () => {
    if (this.renderMode !== RenderMode.NoPage)
      this.setPageNumber(this.currentPageNumber + 1, true)
    else if (this.props.pageSize <= this.currentPageSize)
      this.setPageNumber(this.currentPageNumber + 1, true)
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
    ev.target.value = this.preFormatter(ev.target.value)
    this.setPageNumber(ev.target.value, true)
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
              } ${!+val ? 'disabled' : ''}`.replace(/\s\s+/g, ' ')}
              key={i}
              onClick={this.setPageNumber.bind(this, +val, true)}
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

  componentDidUpdate(
    prevProps: Readonly<PaginationProps>,
    prevState: Readonly<PaginationState>,
  ): void {
    if (
      prevProps.pageIndex !== this.props.pageIndex &&
      Number(this.props.pageIndex || 1) !==
        Number(this.state.$currentPageNumber)
    ) {
      this.setPageNumber(this.props.pageIndex || 1)
    }
  }
}
