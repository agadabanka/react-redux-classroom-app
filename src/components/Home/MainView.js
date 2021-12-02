import ArticleList from '../ArticleList'
import React from 'react'
import agent from '../../agent'
import { connect } from 'react-redux'
import { CHANGE_TAB } from '../../constants/actionTypes'

const YourFeedTab = React.memo(props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault()
      props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed())
    }

    return (
      <li className='nav-item'>
        <button type='button'
          className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
          onClick={clickHandler}>
          Your Feed
        </button>
      </li>
    )
  }
  return null
})

const GlobalFeedTab = React.memo(props => {
  const clickHandler = ev => {
    ev.preventDefault()
    props.onTabClick('all', agent.Articles.all, agent.Articles.all())
  }
  return (
    <li className='nav-item'>
      <button type='button'
        className={props.tab === 'all' ? 'nav-link active' : 'nav-link'}
        onClick={clickHandler}>
        All Subjects Feed
      </button>
    </li>
  )
})

const MathFeedTab = React.memo(props => {
    const clickHandler = ev => {
        ev.preventDefault()
        props.onTabClick('math', agent.Articles.math, agent.Articles.math())
    }
    return (
        <li className='nav-item'>
            <button type='button'
                    className={props.tab === 'math' ? 'nav-link active' : 'nav-link'}
                    onClick={clickHandler}>
                Math Feeds
            </button>
        </li>
    )
})

const AlphaFeedTab = React.memo(props => {
    const clickHandler = ev => {
        ev.preventDefault()
        props.onTabClick('alphaFeed', agent.Articles.alphaFeed, agent.Articles.alphaFeed())
    }
    return (
        <li className='nav-item'>
            <button type='button'
                    className={props.tab === 'alphaFeed' ? 'nav-link active' : 'nav-link'}
                    onClick={clickHandler}>
                Alphabet Feeds
            </button>
        </li>
    )
})

const TagFilterTab = React.memo(props => {
  if (!props.tag) {
    return null
  }

  return (
    <li className='nav-item'>
      <button type='button' className='nav-link active'>
        <i className='ion-pound' /> {props.tag}
      </button>
    </li>
  )
})

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token
})

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
})

const MainView = React.memo(props => {
  return (
    <div className='col-md-9'>
      <div className='feed-toggle'>
        <ul className='nav nav-pills outline-active'>

          <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick} />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

            <MathFeedTab tab={props.tab} onTabClick={props.onTabClick} />

            <AlphaFeedTab tab={props.tab} onTabClick={props.onTabClick} />

          <TagFilterTab tag={props.tag} />

        </ul>
      </div>

      <ArticleList
        pager={props.pager}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(MainView))
