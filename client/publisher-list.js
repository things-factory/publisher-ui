import '@material/mwc-button'
import '@material/mwc-fab'
import '@material/mwc-icon'
import { ScrollbarStyles } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'
import './publisher-header'
import './publisher-footer'

export class PublisherList extends LitElement {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        ul {
          flex: 1;
          width: 95vw;
          list-style: none;
          margin: 5px auto;
          padding: 0;
          overflow: auto;
        }

        ul > li {
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        ul > li > details {
          border: rgba(0, 0, 0, 0.3) 1px solid;
          border-radius: 5px 5px 5px 5px;
        }

        ul > li > details[open] {
          border: none;
        }

        ul > li > details > summary {
          list-style: none;
          display: grid;
          grid-template-columns: 20px 30px 1fr;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 0;
        }

        ul > li > details[open] > summary {
          border: rgba(0, 0, 0, 0.3) 1px solid;
          border-bottom: none;
          border-radius: 5px 5px 0 0;
          /* border-bottom: rgba(0, 0, 0, 0.3) 1px solid; */
        }

        ul > li > details > summary::-webkit-details-marker {
          display: none;
        }

        ul > li > details > div,
        ul > li > details > summary {
          padding: 3px 5px;
        }

        ul > li > details > div {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          justify-content: center;
          border: none;
        }

        ul > li > details[open] > div {
          border: rgba(0, 0, 0, 0.3) 1px dashed;
          border-radius: 0 0 5px 5px;
        }
      `
    ]
  }

  static get properties() {
    return {
      publishers: Array,
      checkedPublishers: Array
    }
  }

  constructor() {
    super()

    this.publishers = []
    this.checkedPublishers = []
  }

  render() {
    return html`
      ${this.checkedPublishers.length > 0
        ? html`
            <publisher-header
              .publishers=${this.publishers}
              .checkedPublishers=${this.checkedPublishers}
              @publisher-list-select-all=${e => this.onPublisherListSelectAll()}
              @publisher-list-deselect-all=${e => this.onPublisherListDeselectAll()}
            ></publisher-header>
          `
        : html``}
      <ul id="list">
        ${this.publishers.map(
          (p, i) => html`
            <li>
              <details
                @click=${e => {
                  var el = e.currentTarget
                  var isOpened = el.hasAttribute('open')

                  if (isOpened) el.removeAttribute('open')
                  else el.setAttribute('open', '')

                  e.preventDefault()
                }}
              >
                <summary @click=${e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    value=${i}
                    @change=${e => {
                      this.getCheckedPublishers()
                    }}
                  />
                  <mwc-icon
                    @click=${e =>
                      this.togglePlayButton({
                        event: e,
                        publisher: p
                      })}
                    >${this.computeIcon(p.status)}</mwc-icon
                  >
                  ${p.name}</summary
                >
                <div>
                  <div>${p.description}</div>
                  <div>
                    <strong>Cron</strong>
                    ${p.cronExpression}
                  </div>
                </div>
              </details>
            </li>
          `
        )}
      </ul>
      ${this.checkedPublishers.length > 0
        ? html`
            <publisher-footer @publisher-delete=${e => this.onPublisherDelete(e)}></publisher-footer>
          `
        : html``}
    `
  }

  updated(changed) {
    if (changed.has('publishers')) this.onPublisherListDeselectAll()
  }

  stateChanged(state) {}

  getCheckedPublishers() {
    var checked = this.renderRoot.querySelectorAll('input[type=checkbox]:checked')
    var checkedIndice = Array.from(checked).map(c => c.value)

    var checkedPublishers = []
    checkedIndice.forEach(idx => {
      checkedPublishers.push(this.publishers[idx])
    })

    this.checkedPublishers = checkedPublishers
  }

  computeIcon(status) {
    switch (status) {
      case 1:
        return 'pause'
      default:
        return 'play_arrow'
    }
  }

  togglePlayButton({ event: e, publisher }) {
    e.preventDefault()
    e.stopPropagation()

    var isStarted = publisher.status == 1
    if (isStarted) {
      this.dispatchEvent(
        new CustomEvent('stop-publisher', {
          bubbles: true,
          composed: true,
          detail: {
            originEvent: e,
            publisher
          }
        })
      )
    } else
      this.dispatchEvent(
        new CustomEvent('start-publisher', {
          bubbles: true,
          composed: true,
          detail: {
            originEvent: e,
            publisher
          }
        })
      )
  }

  onPublisherListSelectAll() {
    var unchecked = this.renderRoot.querySelectorAll('input[type=checkbox]:not(:checked)')
    Array.from(unchecked).forEach(c => {
      c.checked = true
    })

    this.checkedPublishers = [...this.publishers]
  }

  onPublisherListDeselectAll() {
    var unchecked = this.renderRoot.querySelectorAll('input[type=checkbox]:checked')
    Array.from(unchecked).forEach(c => {
      c.checked = false
    })

    this.checkedPublishers = []
  }

  onPublisherDelete(e) {
    e.stopPropagation()
    this.dispatchEvent(
      new CustomEvent('publisher-delete', {
        bubbles: true,
        composed: true,
        detail: {
          ids: this.checkedPublishers.map(p => p.id)
        }
      })
    )
  }
}

window.customElements.define('publisher-list', PublisherList)
