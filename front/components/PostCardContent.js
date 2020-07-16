import PropTypes from 'prop-types'
import Link from 'next/link';

const PostCardContent = ({ postData }) => (
    <div>
        {/* 해시태그 정규표현식 */}
        {postData.split(/(#[^\s#/]+)/g).map((v, i) => {
            /* 해시태그 추출 */
            if (v.match(/(#[^\s#/]+)/g)) {
                return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
            }
            return v;
        })}
    </div>
)

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent