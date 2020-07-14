import { Card, Button, Popover, Avatar } from "antd";
import PropTypes from "prop-types";
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import { useState, useCallback } from 'react'
import { useSelector } from "react-redux";

import PostImages from "./PostImages";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false)

    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev)
    }, [])
    
    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev)
    }, [])

  const id = useSelector((state) => state.user.me?.id);
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked 
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
            : <HeartOutlined key="heart"  onClick={onToggleLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.UserId === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger">삭제</Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={post.content}
        />
      </Card>
      {commentFormOpened && (
          <div>
              댓글 부분
          </div>
      )}
      {/* <CommentForm />
        <Comments /> */}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    UserId: PropTypes.number,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.any),
    Images: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
