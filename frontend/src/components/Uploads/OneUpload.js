import React, { useState, useEffect } from 'react'
import UploadsDataServices from '../../services/upload.service'
import CommentsService from '../../services/comments.service'
import { Link, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import axios from 'axios'
import { isEmpty } from './../Utils/Utils'

import { Modal } from 'antd'

import { Card, Avatar } from 'antd'
import {
  EditOutlined,
  CommentOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import Comments from '../Comments/Comments'

import EditUpload from './EditUpload'
import ModalDelete from '../ModalButton/ModalDelete'

const { Meta } = Card

const OneUpload = props => {
  const currentUser = useSelector(state => state.authReducer).user

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const user = JSON.parse(localStorage.getItem('user'))

  const initialUploadState = {
    id: null,
    title: '',
    description: '',
    image: '',
    userId: null,
    user: []
  }

  const [currentUpload, setCurrentUpload] = useState(initialUploadState)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [message, setMessage] = useState('')

  const changeToFalse = () => {
    setEditMode(false)
    getUpload(props.match.params.id)
  }

  const getUpload = id => {
    UploadsDataServices.get(id)
      .then(response => {
        setCurrentUpload(response.data)
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getComments = uploadId => {
    CommentsService.getAllCommentsByUpload(uploadId)
      .then(response => {
        setComments(response.data)
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const likePost = upload => {
    axios
      .post('http://localhost:5000/api/uploads/like', {
        userId: currentUser.id,
        uploadId: upload
      })
      .then(response => {
        console.log(response.data)
        getUpload(props.match.params.id)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const deletePost = uploadId => {
    UploadsDataServices.delete(uploadId)
      .then(() => {
        // getUpload(props.match.params.id)
        return <Redirect to='/' />
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getUpload(props.match.params.id)
    getComments(props.match.params.id)
  }, [props.match.params.id])

  return (
    <div className='container-fluid container-upload list-uploads'>
      {!isEmpty(currentUpload) ? (
        <div>
          {editMode ? (
            <EditUpload id={currentUpload.id} changeToFalse={changeToFalse} />
          ) : (
            <div>
              {currentUser.id == currentUpload.userId ||
              user.roles == 'ROLE_ADMIN' ? (
                <Card
                className="col-md-auto mx-auto"
                style={{ maxWidth: 800, width: '80%', marginBottom: 20 }}
                  cover={
                    <img
                      alt='picture'
                      src={currentUpload.image}
                      height='700px'
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={() => {
                            likePost(currentUpload.id)
                          }}
                          icon={
                            currentUpload.likes == null ? (
                              <FavoriteBorder />
                            ) : (
                              <Favorite style={{ color: 'red' }} />
                            )
                          }
                          checkedIcon={
                            currentUpload.likes !== null ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder style={{ color: 'grey' }} />
                            )
                          }
                          name='checkedH'
                        />
                      }
                    />,

                    <Link to={`/uploads/${currentUpload.id}`}>
                      <CommentOutlined
                        key='comments'
                        style={{ fontSize: '20px', marginTop: '10px' }}
                        onClick={showModal}
                      />
                    </Link>,
                    <EditOutlined
                      key='edit'
                      style={{ fontSize: '20px', marginTop: '10px' }}
                      onClick={() => setEditMode(true)}
                    />,
                    <ModalDelete id={currentUpload.id} />
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={currentUpload.user.image} />}
                    title={currentUpload.title}
                    description={currentUpload.description}
                  />
                  <br />
                  <br />
                  <blockquote className='blockquote'>
                    <footer className='blockquote-footer'>
                      posté par{' '}
                      <Link
                        to={
                          currentUpload.user.id == currentUser.id
                            ? '/profile'
                            : `/user/${currentUpload.user.id}`
                        }
                        className='post-title'
                      >
                        <cite
                          title={
                            currentUpload.user.firstName +
                            ' ' +
                            currentUpload.user.lastName
                          }
                        >
                          {currentUpload.user.firstName +
                            ' ' +
                            currentUpload.user.lastName}
                        </cite>
                      </Link>
                    </footer>
                  </blockquote>
                  <FavoriteBorder />{' '}
                  {currentUpload._likes ? currentUpload._likes.length : 0}
                </Card>
              ) : (
                <Card
                className="col-md-auto mx-auto"
                  style={{ maxWidth: 800, width: '80%', marginBottom: 20 }}
                  cover={
                    <img
                      alt='picture'
                      src={currentUpload.image}
                      height='700px'
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={() => {
                            likePost(currentUpload.id)
                          }}
                          icon={
                            currentUpload.likes == null ? (
                              <FavoriteBorder />
                            ) : (
                              <Favorite style={{ color: 'red' }} />
                            )
                          }
                          checkedIcon={
                            currentUpload.likes !== null ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder style={{ color: 'grey' }} />
                            )
                          }
                          name='checkedH'
                        />
                      }
                    />,

                    <Link to={`/uploads/${currentUpload.id}`}>
                      <CommentOutlined
                        key='comments'
                        style={{ fontSize: '20px', marginTop: '10px' }}
                        onClick={showModal}
                      />
                    </Link>
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={currentUpload.user.image} />}
                    title={currentUpload.title}
                    description={currentUpload.description}
                  />
                  <br />
                  <br />
                  <blockquote className='blockquote'>
                    <footer className='blockquote-footer'>
                      posté par{' '}
                      <Link
                        to={`/user/${currentUpload.user.id}`}
                        className='post-title'
                      >
                        <cite
                          title={
                            currentUpload.user.firstName +
                            ' ' +
                            currentUpload.user.lastName
                          }
                        >
                          {currentUpload.user.firstName +
                            ' ' +
                            currentUpload.user.lastName}
                        </cite>
                      </Link>
                    </footer>
                  </blockquote>
                  <FavoriteBorder />{' '}
                  {currentUpload._likes ? currentUpload._likes.length : 0}
                </Card>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <br />
          <Link to={'/'}>
            <h2>Post supprimé !</h2>
            <button className='btn btn-model'>Retour à l'accueil</button>
          </Link>
        </div>
      )}

      <Modal
        title='Commentaires'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Comments id={props.match.params.id} />
      </Modal>
    </div>
  )
}

export default OneUpload