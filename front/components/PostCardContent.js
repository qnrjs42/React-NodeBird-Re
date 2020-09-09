import Link from "next/link";
import PropTypes from "prop-types";

// 첫 번째 게시글 #해시태그 #익스프레스\
const PostCardContent = ({ postData }) => (
  <div>
    {postData.split(/(#[^\s#]+)/g).map((v, index) => {
      if (v.match(/(#[^\s#]+)/g)) {
        return (
          <Link href={`/hashtag/${v.slice(1)}`} key={index}>
            <a>{v}</a>
          </Link>
        );
      }
      return v;
    })}
  </div>
);

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;
