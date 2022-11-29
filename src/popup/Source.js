import duplicateIcon from '../../public/assets/duplicate-icon.png'
import recycleBinIcon from '../../public/assets/recycle-bin-icon.png'
import { useDispatch } from 'react-redux'
import { editSource } from './SourceSlice'

export default function Source({ id, from, to, active }) {
  const dispatch = useDispatch()

  const handleInputChange = (sourceKey) => ({target}) => {
    if (!target.value) return
    // TODO don't trigger if same value already in (memo?)
    dispatch(editSource({ id, key: sourceKey, value: target.value }));
  }

  return (
    <div className={`source ${id}`}>
      <div className="check">
        <input type="checkbox" active={active.toString()} />
      </div>

      <div className="panel">
        <div className="left">
          <div className="from">
            <label htmlFor="from">From:</label>
            <br />
            <input
              type="text"
              id="from"
              placeholder="Base Source"
              defaultValue={from}
              data-type="from"
              onKeyUp={handleInputChange('from')}
            />
          </div>

          <div className="to">
            <label htmlFor="to">To:</label>
            <br/>
            <input
              type="text"
              id="to"
              placeholder="Destination Source"
              defaultValue={to}
              data-type="to"
              onKeyUp={handleInputChange('to')}
            />
          </div>
        </div>

        {/* TODO: replace png icons with svg */}
        <div className="right">
          <div className="tooltip duplicate-icon">
            <img
              src={duplicateIcon}
              alt="duplicate icon"
            />
            <span className="tooltiptext">Duplicate this source</span>
          </div>


          <div className="tooltip recycle-bin-icon">
            <img
              src={recycleBinIcon}
              alt="recycle bin"
            />
            <span className="tooltiptext">Delete this source</span>
          </div>
        </div>
      </div>
    </div>
  )
}
