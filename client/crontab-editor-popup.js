import { LitElement, html, css } from 'lit-element'
import '@material/mwc-button'
import { i18next } from '@things-factory/i18n-base'

export class CrontabEditorPopup extends LitElement {
  static get properties() {
    return {
      values: Array,
      second: String,
      minute: String,
      hour: String,
      dayOfMonth: String,
      month: String,
      dayOfWeek: String,
      _tooltip: Array
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;

        width: 100%;
        height: 100%;

        border: 0;
        background-color: var(--main-section-background-color);
      }

      :host * {
        box-sizing: border-box;
      }

      #wrapper {
        display: grid;
        width: 100%;
        height: 100%;
        padding: 1rem;
        grid-template-rows: auto 1fr auto;
        align-items: stretch;
        justify-content: center;
      }

      #crontab-input-area {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-gap: 0.5rem;
      }

      #crontab-input-area > input {
        width: 100%;
      }

      #tooltip {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      mwc-button {
        justify-self: flex-end;
      }
    `
  }

  render() {
    return html`
      <div
        id="wrapper"
        @keydown=${e => {
          if (e.key === 'Tab') {
            e.stopPropagation()
            e.preventDefault()
            var focused = this.renderRoot.querySelector(':focus')
            var focusedIdx = this.focusableElements.findIndex(el => el == focused)
            var nextFocusIdx = (e.shiftKey ? focusedIdx - 1 : focusedIdx + 1) % this.focusableElements.length
            if (nextFocusIdx == -1) nextFocusIdx = this.focusableElements.length - 1

            this.focusableElements[nextFocusIdx].focus()
          }
        }}
      >
        <div id="crontab-input-area">
          <input
            type="text"
            .value=${this.second}
            @change=${e => (this.second = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'second' })
            }}
          />
          <input
            type="text"
            .value=${this.minute}
            @change=${e => (this.minute = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'minute' })
            }}
          />
          <input
            type="text"
            .value=${this.hour}
            @change=${e => (this.hour = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'hour' })
            }}
          />
          <input
            type="text"
            .value=${this.dayOfMonth}
            @change=${e => (this.dayOfMonth = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'dayOfMonth' })
            }}
          />
          <input
            type="text"
            .value=${this.month}
            @change=${e => (this.month = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'month' })
            }}
          />
          <input
            type="text"
            .value=${this.dayOfWeek}
            @change=${e => (this.dayOfWeek = e.currentTarget.value)}
            @focus=${e => {
              this.showTooltip({ type: 'dayOfWeek' })
            }}
          />
        </div>
        <div id="tooltip">
          ${this._tooltip.map(
            tip => html`
              <div>${tip}</div>
            `
          )}
        </div>
        <mwc-button
          icon="done"
          .label="${i18next.t('label.ok')}"
          @click=${e => {
            this.dispatchEvent(
              new CustomEvent('crontab-changed', {
                bubbles: true,
                composed: true,
                detail: {
                  value: `${this.second} ${this.minute} ${this.hour} ${this.dayOfMonth} ${this.month} ${this.dayOfWeek}`
                }
              })
            )
          }}
        ></mwc-button>
      </div>
    `
  }

  get focusableElements() {
    return Array.from(this.renderRoot.querySelectorAll('input, mwc-button'))
  }

  connectedCallback() {
    super.connectedCallback()

    this._tooltip = []
  }

  firstUpdated() {
    this.second = this.values[0]
    this.minute = this.values[1]
    this.hour = this.values[2]
    this.dayOfMonth = this.values[3]
    this.month = this.values[4]
    this.dayOfWeek = this.values[5]

    this.renderRoot.querySelector('input').focus()
  }

  showTooltip({ type }) {
    switch (type) {
      case 'second':
      case 'minute':
        this._tooltip = [
          '*	any value',
          ',	value list separator',
          '-	range of values',
          '/	step values',
          '0-59 allowed values'
        ]
        break
      case 'hour':
        this._tooltip = [
          '*	any value',
          ',	value list separator',
          '-	range of values',
          '/	step values',
          '0-23 allowed values'
        ]
        break

      case 'dayOfMonth':
        this._tooltip = [
          '*	any value',
          ',	value list separator',
          '-	range of values',
          '/	step values',
          '0-31 allowed values'
        ]
        break

      case 'month':
        this._tooltip = [
          '*	any value',
          ',	value list separator',
          '-	range of values',
          '/	step values',
          '1-12 allowed values',
          'JAN-DEC alternative single values'
        ]
        break

      case 'dayOfWeek':
        this._tooltip = [
          '*	any value',
          ',	value list separator',
          '-	range of values',
          '/	step values',
          '0-6 allowed values',
          'SUN-SAT alternative single values'
        ]
        break

      default:
        this._tooltip = []
        break
    }
  }
}

customElements.define('crontab-editor-popup', CrontabEditorPopup)
