// @flow

/* eslint-disable complexity */

import React from 'react'
import Tooltip from 'react-tippy'
import Measure from 'react-measure'
import ArrowIcon from 'part:@sanity/base/angle-down-icon'
import Button from 'part:@sanity/components/buttons/default'
import ChevronDown from 'part:@sanity/base/chevron-down-icon'
import CloseIcon from 'part:@sanity/base/close-icon'
import FullscreenIcon from 'part:@sanity/base/fullscreen-icon'
import ValidationList from 'part:@sanity/components/validation/list'
import WarningIcon from 'part:@sanity/base/warning-icon'
import Poppable from 'part:@sanity/components/utilities/poppable'
import {debounce, xor} from 'lodash'

import type {BlockContentFeatures, SlateValue, Path, SlateEditor, Type} from '../typeDefs'

import IS_MAC from '../utils/isMac'
import PrimaryGroup from './PrimaryGroup'
import styles from './styles/Toolbar.css'

const collapsibleGroups = ['insertMenu', 'annotationButtons', 'decoratorButtons', 'listItemButtons']
const BREAKPOINT_SCREEN_MEDIUM = 512

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editor: SlateEditor,
  editorValue: SlateValue,
  fullscreen: boolean,
  onFocus: Path => void,
  onToggleFullScreen: void => void,
  markers: [],
  style: {},
  type: Type,
  userIsWritingText: boolean
}

type State = {
  collapsePrimaryIsOpen: boolean,
  showValidationTooltip: boolean,
  collapsePrimary: boolean,
  collapsedGroups: any,
  isMobile: boolean,
  lastContentWidth: number
}

class Toolbar extends React.PureComponent<Props, State> {
  state = {
    collapsePrimaryIsOpen: false,
    collapsePrimary: false,
    showValidationTooltip: false,
    collapsedGroups: [],
    lastContentWidth: -1,
    isMobile: false
  }

  _primaryToolbar = React.createRef()

  componentDidMount() {
    if (window) {
      this.setState({isMobile: window.innerWidth < BREAKPOINT_SCREEN_MEDIUM})
    }
  }

  handleOpenPrimary = () => {
    this.setState({
      collapsePrimaryIsOpen: true
    })
  }

  handleClosePrimary = () => {
    this.setState({
      collapsePrimaryIsOpen: false
    })
  }

  handleClickOutsidePrimary = () => {
    this.setState({
      collapsePrimaryIsOpen: false
    })
  }

  handleFocus = (focusPath: []) => {
    const {onFocus} = this.props
    onFocus(focusPath)
  }

  handleCloseValidationResults = () => {
    this.setState({showValidationTooltip: false})
  }

  handleToggleValidationResults = () => {
    this.setState(prevState => ({showValidationTooltip: !prevState.showValidationTooltip}))
  }

  handleResize = debounce(() => {
    if (this.state.isMobile) return

    const {_primaryToolbar} = this
    const {collapsedGroups, lastContentWidth, collapsePrimary} = this.state

    if (!_primaryToolbar || !_primaryToolbar.current) return

    const width = _primaryToolbar.current.offsetWidth
    const contentWidth = _primaryToolbar.current.scrollWidth
    if (contentWidth > width && !collapsePrimary) {
      const groupToCollapse = xor(collapsibleGroups, collapsedGroups)[0]
      this.setState(
        {collapsedGroups: [...collapsedGroups, groupToCollapse], lastContentWidth: contentWidth},
        () => {
          if (contentWidth > width && collapsedGroups.length != collapsibleGroups.length) {
            this.handleResize()
          } else if (collapsedGroups.length === collapsibleGroups.length && contentWidth > width) {
            this.setState({collapsePrimary: true})
          }
        }
      )
    }

    if (collapsePrimary && lastContentWidth < width) {
      this.setState({
        collapsePrimary: false,
        collapsePrimaryIsOpen: false
      })
    }

    if (width >= lastContentWidth && collapsedGroups.length != 0) {
      this.setState({
        collapsedGroups: []
      })
    }
  }, 50)

  render() {
    const {
      blockContentFeatures,
      editor,
      fullscreen,
      markers,
      onToggleFullScreen,
      style,
      type
    } = this.props

    if (!editor) {
      return null
    }

    const {showValidationTooltip, isMobile} = this.state

    const insertItems = blockContentFeatures.types.inlineObjects.concat(
      blockContentFeatures.types.blockObjects
    )

    const validation = markers.filter(marker => marker.type === 'validation')
    const errors = validation.filter(marker => marker.level === 'error')
    const warnings = validation.filter(marker => marker.level === 'warning')

    const {collapsedGroups, collapsePrimary, collapsePrimaryIsOpen} = this.state

    return (
      <Measure offset scroll onResize={contentRect => this.handleResize(contentRect)}>
        {({measureRef}) => (
          <div
            ref={measureRef}
            style={style}
            className={`
              ${styles.root}
              ${fullscreen ? ` ${styles.fullscreen}` : ''}
            `}
          >
            <div className={styles.primary} ref={this._primaryToolbar}>
              {collapsePrimary && (
                <Button
                  className={styles.showMoreButton}
                  onClick={this.handleOpenPrimary}
                  kind="simple"
                >
                  Show menu&nbsp;
                  <span className={styles.arrow}>
                    <ArrowIcon color="inherit" />
                  </span>
                  <Poppable
                    onClickOutside={this.handleClosePrimary}
                    onEscape={this.handleClosePrimary}
                  >
                    {collapsePrimaryIsOpen && (
                      <PrimaryGroup
                        {...this.props}
                        isPopped
                        collapsedGroups={collapsedGroups}
                        insertItems={insertItems}
                      />
                    )}
                  </Poppable>
                </Button>
              )}
              <div className={styles.primaryInner}>
                {!collapsePrimary && (
                  <PrimaryGroup
                    {...this.props}
                    collapsedGroups={collapsedGroups}
                    insertItems={insertItems}
                    isMobile={isMobile}
                  />
                )}
              </div>
            </div>
            <div className={styles.secondary}>
              {fullscreen && (errors.length > 0 || warnings.length > 0) && (
                <Tooltip
                  arrow
                  duration={100}
                  html={
                    <ValidationList
                      markers={validation}
                      showLink
                      isOpen={showValidationTooltip}
                      documentType={type}
                      onClose={this.handleCloseValidationResults}
                      onFocus={this.handleFocus}
                    />
                  }
                  interactive
                  onRequestClose={this.handleCloseValidationResults}
                  open={showValidationTooltip}
                  position="bottom"
                  style={{padding: 0}}
                  theme="light noPadding"
                  trigger="click"
                >
                  <Button
                    color="danger"
                    icon={WarningIcon}
                    kind="simple"
                    onClick={this.handleToggleValidationResults}
                    padding="small"
                  >
                    {errors.length}
                    <span style={{paddingLeft: '0.5em'}}>
                      <ChevronDown />
                    </span>
                  </Button>
                </Tooltip>
              )}
              <div className={styles.fullscreenButtonContainer}>
                <Button
                  kind="simple"
                  onClick={onToggleFullScreen}
                  title={`Open in fullscreen (${IS_MAC ? 'cmd' : 'ctrl'}+enter)`}
                  icon={fullscreen ? CloseIcon : FullscreenIcon}
                />
              </div>
            </div>
          </div>
        )}
      </Measure>
    )
  }
}

export default Toolbar
