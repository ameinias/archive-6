import { GameLogic } from '../../utils/gamelogic';

const textEntry = ({ txt }: { txt?: string }) => {
  const { isAdmin, toggleAdmin } = GameLogic();

return(
  <div>
    {isAdmin ?
         <input
          className="form-control"
          type="text"
          name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleChange}
        />
    :

}
  </div>

)

}

export default Search
