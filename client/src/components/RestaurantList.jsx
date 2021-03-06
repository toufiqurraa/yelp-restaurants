import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { RestaurantContext } from '../context/RestaurantContext'
import StarRating from './StarRating'

const API_URL = '/api/restaurants/'

const RestaurantList = () => {
  const { restaurants, setRestaurants } = useContext(RestaurantContext)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL)

        setRestaurants(response.data.data.restaurants)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [setRestaurants])

  // update restaurants
  const handleUpdate = (e, id) => {
    e.stopPropagation()
    navigate(`/restaurants/${id}/update`)
  }

  // delete restaurants
  const handleDelete = async (e, id) => {
    e.stopPropagation()

    try {
      await axios.delete(API_URL + id)

      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  // handle click on restaurant name forwards to restaurant detail
  const handleRestaurantDetail = (id) => {
    navigate(`/restaurants/${id}`)
  }

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className='text-warning'>0 reviews</span>
    }
    return (
      <>
        <StarRating rating={restaurant.id} />
        <span className='text-warning ml-1'>({restaurant.count})</span>
      </>
    )
  }

  return (
    <div className='list-group'>
      <table className='table table-dark table-hover'>
        <thead>
          <tr className='bg-primary'>
            <th scope='col'>Restaurants</th>
            <th scope='col'>Locations</th>
            <th scope='col'>Price Range</th>
            <th scope='col'>Rating</th>
            <th scope='col'>Edit</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>

        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr key={restaurant.id} onClick={() => handleRestaurantDetail(restaurant.id)}>
                  <td role='button' tabIndex='0'>
                    {restaurant.name}
                  </td>

                  <td>{restaurant.location}</td>

                  <td>{'$'.repeat(restaurant.price_range)}</td>

                  <td>{renderRating(restaurant)}</td>

                  <td>
                    <button onClick={(e) => handleUpdate(e, restaurant.id)} className='btn btn-warning'>
                      Update
                    </button>
                  </td>

                  <td>
                    <button onClick={(e) => handleDelete(e, restaurant.id)} className='btn btn-danger'>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default RestaurantList
