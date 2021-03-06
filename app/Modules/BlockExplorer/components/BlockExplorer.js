import React, { Component } from 'react'
import Moment from 'react-moment'
import EtherUtil from 'ethereumjs-util'

import EmptyTransactions from './EmptyTransactions'

import WithEmptyState from 'Elements/WithEmptyState'
import InputText from 'Elements/InputText'

import Styles from './BlockExplorer.css'

export default class BlockExplorer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentBlockNumberSearch: '',
      currentBlockSearchMatch: null,
      currentTxSearchMatch: null,
      currentTxSearch: '',
      isSearchingForBlock: false,
      isSearchingForTx: false,
      blockSearchMatch: false,
      txSearchMatch: false
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.testRpcState.currentBlockSearchMatch !== null && nextProps.testRpcState.currentBlockSearchMatch !== this.props.testRpcState.currentBlockSearchMatch) {
      this.setState({
        currentBlockSearchMatch: nextProps.testRpcState.currentBlockSearchMatch,
        isSearchingForBlock: false,
        blockSearchMatch: true
      })
    }

    if (nextProps.testRpcState.currentTxSearchMatch !== null && nextProps.testRpcState.currentTxSearchMatch !== this.props.testRpcState.currentTxSearchMatch) {
      this.setState({
        currentTxSearchMatch: nextProps.testRpcState.currentTxSearchMatch,
        isSearchingForTx: false,
        txSearchMatch: true
      })
    }
  }

  render () {
    return (
      <div className={Styles.BlockExplorer}>
        <div className={Styles.Blocks}>
          <h4>
            { this.state.currentBlockSearchMatch
              ? `Showing Block #${EtherUtil.bufferToInt(this.state.currentBlockSearchMatch.header.number)}`
              : `LAST 5 BLOCKS`
            }
          </h4>
          <header>
          { this.state.currentBlockSearchMatch
            ? <section className={Styles.DismissSearchResult}>
              &larr; <a href="#" onClick={this._handleClearBlockSearch}>Go back to All Blocks</a>
            </section>
          : <InputText
              className={Styles.BlockSearchInput}
              placeholder={'Search for Block Number'}
              delay={0}
              value={this.state.currentBlockNumberSearch}
              onEnter={this._handleBlockNumberSearch}
              onChange={this._handleBlockNumberSearchChange}
            />
          }
          </header>
          <main>
            <ul className={Styles.BlockList}>
              { !this.state.isSearchingForBlock && !this.state.blockSearchMatch
                ? this._renderBlocks()
                : this.state.currentBlockSearchMatch === null
                ? this._renderSearchingBlock()
                : this._renderBlockSearchMatch()
              }
            </ul>
          </main>
          <footer>
          </footer>
        </div>
        <div className={Styles.Transactions}>
          <h4>
            { this.state.currentTxSearchMatch
            ? `SHOWING TX ${this.state.currentTxSearchMatch.tx.hash}`
            : `LAST 5 TRANSACTIONS`
            }
          </h4>
          <header>
          { this.state.currentTxSearchMatch
            ? <section className={Styles.DismissSearchResult}>
              &larr; <a href="#" onClick={this._handleClearTxSearch}>Go back to All TXs</a>
            </section>
            : <InputText
              className={Styles.TxSearchInput}
              placeholder={'Search for TX Hash'}
              delay={0}
              value={this.state.currentTxSearch}
              onEnter={this._handleTxSearch}
              onChange={this._handleTxSearchChange}
            />
          }
          </header>
          <main>
            <WithEmptyState
              test={this.props.testRpcState.transactions.length === 0}
              emptyStateComponent={EmptyTransactions}
            >
              <ul className={Styles.TransactionList}>
                { !this.state.isSearchingForTx && !this.state.txSearchMatch
                  ? this._renderTransactions()
                  : this.state.currentTxSearchMatch === null
                  ? this._renderSearchingTx()
                  : this._renderTxSearchMatch()
                }
              </ul>
            </WithEmptyState>
          </main>
          <footer>
          </footer>
        </div>
      </div>
    )
  }

  _handleBlockNumberSearch = (value) => {
    this.setState({isSearchingForBlock: true})
    this.props.appSearchBlock(value)
  }

  _handleBlockNumberSearchChange = (value) => {
    this.setState({currentBlockNumberSearch: value})
  }

  _handleTxSearch = (value) => {
    this.setState({isSearchingForTx: true})
    this.props.appSearchTx(value)
  }

  _handleTxSearchChange = (value) => {
    this.setState({currentTxSearch: value})
  }

  _handleClearBlockSearch = (e) => {
    e.preventDefault()
    this.setState({blockSearchMatch: false, currentBlockNumberSearch: '', currentBlockSearchMatch: null})
  }

  _handleClearTxSearch = (e) => {
    e.preventDefault()
    this.setState({txSearchMatch: false, currentTxNumberSearch: '', currentTxSearchMatch: null})
  }

  _handleTxShow = (txHash, e) => {
    console.log(e, txHash)
    e.preventDefault()
    this._handleTxSearch(txHash)
  }

  _renderRecentTransaction = (transactions) => {
    if (transactions.length === 0) {
      return 'NO TRANSACTIONS'
    }

    return transactions.map((tx) => {
      const txHash = EtherUtil.bufferToHex(tx.hash)
      return (
        <a href="#" onClick={this._handleTxShow.bind(this, txHash)}>{txHash}</a>
      )
    })
  }

  _renderSearchingTx = () => {
    return (
      <section>
        Searching for Transaction {this.state.currentTxNumberSearch}
      </section>
    )
  }

  _renderTxSearchMatch = () => {
    const tx = this.state.currentTxSearchMatch
    console.log(tx)
    return this.state.currentTxSearchMatch && this._renderTransactionCard(tx.tx)
  }

  _renderTransactionCard = (tx) => {
    return (
      <li className={Styles.Transaction} key={tx.hash}>
        <section>
          <table className={Styles.TransactionData}>
            <tr>
              <td>
                <dl>
                  <dt>Transaction Hash</dt>
                  <dd>{EtherUtil.bufferToHex(tx.hash)}</dd>
                </dl>
              </td>
              <td>
              </td>
            </tr>
            <tr>
              <td>
                <dl>
                  <dt>From</dt>
                  <dd>{EtherUtil.bufferToHex(tx.from)}</dd>
                </dl>
              </td>
              <td>
                <dl>
                  <dt>To</dt>
                  <dd>{EtherUtil.bufferToHex(tx.to)}</dd>
                </dl>
              </td>
            </tr>
            <tr>
              <td>
                <dl>
                  <dt>Nonce</dt>
                  <dd>{EtherUtil.bufferToHex(tx.nonce)}</dd>
                </dl>
              </td>
              <td>
                <dl>
                  <dt>Value</dt>
                  <dd>{EtherUtil.bufferToHex(tx.value)}</dd>
                </dl>
              </td>
            </tr>
            <tr>
              <td>
                <dl>
                  <dt>Init</dt>
                  <dd>{EtherUtil.bufferToHex(tx.init)}</dd>
                </dl>
              </td>
              <td>
                <dl>
                  <dt>Value</dt>
                  <dd>{EtherUtil.bufferToHex(tx.value)}</dd>
                </dl>
              </td>
            </tr>
            <tr>
              <td>
                <dl>
                  <dt>Gas Price</dt>
                  <dd>{EtherUtil.bufferToHex(tx.gasPrice)}</dd>
                </dl>
                <dl>
                  <dt>Data</dt>
                  <dd className={Styles.TxData}>{EtherUtil.bufferToHex(tx.data)}</dd>
                </dl>
              </td>
              <td>
                <dl>
                  <dt>Gas Limit</dt>
                  <dd>{EtherUtil.bufferToHex(tx.gasLimit)}</dd>
                </dl>
                <dl>
                  <dt>V</dt>
                  <dd>{EtherUtil.bufferToHex(tx.v)}</dd>
                </dl>
                <dl>
                  <dt>R</dt>
                  <dd>{EtherUtil.bufferToHex(tx.r)}</dd>
                </dl>
                <dl>
                  <dt>S</dt>
                  <dd>{EtherUtil.bufferToHex(tx.s)}</dd>
                </dl>
              </td>
            </tr>
          </table>
        </section>
      </li>
    )
  }

  _renderTransactions = () => {
    return this.props.testRpcState.transactions.map(this._renderTransactionCard)
  }

  _renderSearchingBlock = () => {
    return (
      <section>
        Searching for Block {this.state.currentBlockNumberSearch}
      </section>
    )
  }

  _renderBlockSearchMatch = () => {
    const block = this.state.currentBlockSearchMatch
    return this.state.currentBlockSearchMatch && this._renderBlockCard(block)
  }

  _renderBlockCard = (block) => {
    return (
      <li className={Styles.Block} key={EtherUtil.bufferToHex(block.hash)}>
        <section>
          <span className={Styles.BlockNumber}>
            <p>Block Number</p>
            {EtherUtil.bufferToInt(block.header.number)}
          </span>
          <table className={Styles.BlockData}>
            <tr>
              <td>
                <dl>
                  <dt>Block Hash</dt>
                  <dd>{EtherUtil.bufferToHex(block.hash)}</dd>
                </dl>
                <dl>
                  <dt>Transactions ({block.transactions.length})</dt>
                  <dd>{
                    this._renderRecentTransaction(block.transactions)
                  }</dd>
              </dl>
              <dl>
                <dt>Bloom</dt>
                <dd className={Styles.Bloom}>{EtherUtil.bufferToHex(block.header.bloom)}</dd>
              </dl>
            </td>
            <td>
              <dl>
                <dt>Parent Hash</dt>
                <dd>{EtherUtil.bufferToHex(block.header.parentHash)}</dd>
              </dl>
              <dl>
                <dt>Gas Used / Gas Limit</dt>
                <dd>{EtherUtil.bufferToHex(block.header.gasUsed)} / {EtherUtil.bufferToHex(block.header.gasLimit)}</dd>
              </dl>
              <dl>
                <dt>Nonce</dt>
                <dd>{EtherUtil.bufferToHex(block.header.nonce)}</dd>
              </dl>
              <dl>
                <dt>Mined On</dt>
                <dd><Moment unix>{EtherUtil.bufferToInt(block.header.timestamp)}</Moment></dd>
              </dl>
              <dl>
                <dt>Mix Hash</dt>
                <dd>{EtherUtil.bufferToHex(block.header.mixHash)}</dd>
              </dl>
              <dl>
                <dt>Receipts Root</dt>
                <dd>{EtherUtil.bufferToHex(block.header.receiptTrie)}</dd>
              </dl>
              <dl>
                <dt>State Root</dt>
                <dd>{EtherUtil.bufferToHex(block.header.stateRoot)}</dd>
              </dl>
              <dl>
                <dt>Extra Data</dt>
                <dd><pre>{EtherUtil.bufferToHex(block.header.extraData)}</pre></dd>
              </dl>
            </td>
          </tr>
        </table>
      </section>
    </li>
    )
  }

  _renderBlocks = () => {
    return this.props.testRpcState.blocks.map(this._renderBlockCard)
  }
}
