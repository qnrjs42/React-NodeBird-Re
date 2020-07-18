import React, { useCallback, useRef, useEffect } from "react";
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";

import { addPost } from '../reducers/post'
import useInput from '../hooks/useInput'

const PostForm = () => {
    const { imagePaths, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    
    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if(addPostDone) {
            setText('');
        }
    }, [addPostDone])

    const onSubmit = useCallback(() => {
        /*
            dispatch(addPost(text));
            setText('');
            생각하면 게시글 업로드하고 새 게시글 생성하기 위해서는 게시글 입력칸을 비워줘야한다
            위의 방법은 addPost가 에러를 리턴하고 setText('')로 text를 비워버려서 에러를 확인할 수 없게 된다
            그래서 useEffect() 함수를 사용한다
        */
       dispatch(addPost(text));

    }, [text])

    const imageInput = useRef();
    const onClickImagUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current])

    return (
        <Form style= {{ margin : '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
            <div>
                <input type="file" multiple hidden ref={imageInput} />
                <Button onClick={onClickImagUpload}>이미지 업로드</Button>
                <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
            </div>
            <div>
                { imagePaths.map((v) => (
                    <div key={v} style={{ display: 'inline-block' }}>
                        <img src={v} style={{ width: '200px' }} alt={v} />
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div> 
                ))}
            </div>
        </Form>
    )
}

export default PostForm