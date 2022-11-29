import Source from './Source'
import { useSelector, useDispatch } from 'react-redux'
import { selectSources, addSource } from './SourceSlice'

export default function Popup() {
  const sources = useSelector(selectSources)
  const dispatch = useDispatch()

  return (
    <>
      <div className="sources">
        {sources && Object.entries(sources).map(([key, sourceProps], idx) => (
          <Source key={`source-${idx}`} id={key} {...sourceProps} />
        ))}
      </div>

      <button className="add-source" onClick={() => dispatch(addSource())}>
        +
      </button>
    </>
  );
}
