/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */

import React from 'react'
import Ink from 'react-ink'
import {storiesOf} from 'part:@sanity/storybook'
import {withKnobs, text, boolean, number} from 'part:@sanity/storybook/addons/knobs'
import HamburgerIcon from 'part:@sanity/base/hamburger-icon'
import PlusIcon from 'part:@sanity/base/plus-icon'
import PluginIcon from 'part:@sanity/base/plugin-icon'
import ViewColumnIcon from 'part:@sanity/base/view-column-icon'
import Branding from './components/Branding'
import ToolSwitcherWidget from './components/ToolSwitcherWidget'
import NotFound from './components/NotFound'
import LoginStatus from './components/LoginStatus'
import SearchField from './components/SearchField'
import SearchResults from './components/SearchResults'
import ToolSwitcherItem from './components/ToolSwitcherItem'

import NavBarStyles from './components/styles/NavBar.css'
import DefaultLayoutStyles from './components/styles/DefaultLayout.css'

storiesOf('[tool] Default layout')
  .addDecorator(withKnobs)
  .add('Example', () => {
    const menuIsOpen = boolean('menuIsOpen', false, 'props')
    const searchIsOpen = boolean('searchIsOpen', false, 'props')
    const isOverlayVisible = menuIsOpen || searchIsOpen
    let className = DefaultLayoutStyles.root
    if (isOverlayVisible) className += ` ${DefaultLayoutStyles.isOverlayVisible}`
    return (
      <div className={className}>
        <div className={DefaultLayoutStyles.navBar}>
          <div className={NavBarStyles.root}>
            <div className={NavBarStyles.hamburger}>
              <button
                className={NavBarStyles.hamburgerButton}
                type="button"
                title="Menu"
                onClick={() => console.log('onClick()')}
              >
                <HamburgerIcon />
              </button>
            </div>
            <a className={NavBarStyles.branding} href="#" onClick={evt => evt.preventDefault()}>
              <Branding />
            </a>
            <a className={NavBarStyles.createButton} onClick={() => console.log('onClick()')}>
              <span className={NavBarStyles.createButtonIcon}>
                <PlusIcon />
              </span>
              <span className={NavBarStyles.createButtonText}>New</span>
              <Ink duration={200} opacity={0.1} radius={200} />
            </a>
            <div className={NavBarStyles.search}>
              <SearchField
                hotkeys={['F']}
                isFocused={boolean('searchIsFocused', false, 'props')}
                isOpen={searchIsOpen}
                results={
                  <SearchResults
                    activeIndex={number('searchActiveIndex', -1, 'props')}
                    isLoading={boolean('searchIsLoading', false, 'props')}
                    items={[]}
                    query={''}
                    renderItem={key => (
                      <div key={key} style={{padding: '0.5em 0.75em'}}>
                        {key}
                      </div>
                    )}
                  />
                }
                value={''}
                onChange={() => console.log('change')}
              />
            </div>
            <div className={NavBarStyles.toolSwitcher}>
              <ToolSwitcherWidget
                onSwitchTool={event => console.log('onSwitchTool()', event)}
                tools={[
                  {
                    name: 'Desk tool',
                    icon: ViewColumnIcon
                  },
                  {
                    name: 'Plugin 1',
                    icon: PluginIcon
                  },
                  {
                    name: 'Plugin 2',
                    icon: PluginIcon
                  }
                ]}
                renderItem={tool => <ToolSwitcherItem title={tool.name} icon={tool.icon} />}
              />
            </div>
            <div className={NavBarStyles.loginStatus}>
              <LoginStatus
                user={{
                  name: 'John Doe',
                  profileImage: 'https://randomuser.me/api/portraits/men/12.jpg'
                }}
                onLogout={() => console.log('logout')}
              />
            </div>
          </div>
        </div>
      </div>
    )
  })
  .add('Branding', () => {
    return (
      <div className={DefaultLayoutStyles.navBar}>
        <div className={NavBarStyles.root}>
          <div className={NavBarStyles.branding}>
            <Branding />
          </div>
        </div>
      </div>
    )
  })
  .add('Toolswitcher', () => {
    return (
      <div className={DefaultLayoutStyles.navBar}>
        <div className={NavBarStyles.root}>
          <div className={NavBarStyles.toolSwitcher}>
            <ToolSwitcherWidget
              onSwitchTool={event => console.log('onSwitchTool()', event)}
              tools={[
                {
                  name: 'Desk tool',
                  icon: ViewColumnIcon
                },
                {
                  name: 'Plugin 1',
                  icon: PluginIcon
                },
                {
                  name: 'Plugin 2',
                  icon: PluginIcon
                }
              ]}
              renderItem={tool => <ToolSwitcherItem title={tool.name} icon={tool.icon} />}
            />
          </div>
        </div>
      </div>
    )
  })
  .add('ToolSwitcherItem', () => {
    return (
      <div className={DefaultLayoutStyles.navBar}>
        <div className={NavBarStyles.root}>
          <div className={NavBarStyles.toolSwitcher}>
            <ToolSwitcherItem title={text('title (prop)', 'Desk tool')} icon={ViewColumnIcon} />
          </div>
        </div>
      </div>
    )
  })
  .add('Not Found', () => {
    return <NotFound />
  })
  .add('Login Status', () => {
    return (
      <div className={DefaultLayoutStyles.navBar}>
        <div className={NavBarStyles.root}>
          <div className={NavBarStyles.loginStatus}>
            <LoginStatus
              user={{
                name: 'John Doe',
                profileImage: 'https://randomuser.me/api/portraits/men/12.jpg'
              }}
              onLogout={() => console.log('logout')}
            />
          </div>
        </div>
      </div>
    )
  })
  .add('Search Field (mobile)', () => {
    const hasResults = boolean('hasResults', false, 'props')
    const items = hasResults ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] : []
    const query = text('query', '', 'props')

    return (
      <div style={{background: '#444', height: '100vh'}}>
        <div style={{background: '#fff', margin: '0 auto', position: 'relative'}}>
          <SearchField
            isBleeding
            isFocused={boolean('isFocused', false, 'props')}
            isOpen={boolean('isOpen', false, 'props')}
            results={
              <SearchResults
                activeIndex={number('activeIndex', -1, 'props')}
                isLoading={boolean('isLoading', false, 'props')}
                items={items}
                query={query}
                renderItem={key => (
                  <div key={key} style={{padding: '0.75em 1em'}}>
                    {key}
                  </div>
                )}
              />
            }
            value={query}
            onChange={() => console.log('change')}
          />
        </div>
      </div>
    )
  })
  .add('Search Field (desktop)', () => {
    const hasResults = boolean('hasResults', false, 'props')
    const items = hasResults ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] : []
    const query = text('query', '', 'props')

    return (
      <div>
        <div className={DefaultLayoutStyles.navBar}>
          <div className={NavBarStyles.root}>
            <div className={NavBarStyles.search}>
              <SearchField
                hotkeys={['F']}
                isFocused={boolean('isFocused', false, 'props')}
                isOpen={boolean('isOpen', false, 'props')}
                results={
                  <SearchResults
                    activeIndex={number('activeIndex', -1, 'props')}
                    isLoading={boolean('isLoading', false, 'props')}
                    items={items}
                    query={query}
                    renderItem={key => (
                      <div key={key} style={{padding: '0.5em 0.75em'}}>
                        {key}
                      </div>
                    )}
                  />
                }
                value={query}
                onChange={() => console.log('change')}
              />
            </div>
          </div>
        </div>
      </div>
    )
  })
