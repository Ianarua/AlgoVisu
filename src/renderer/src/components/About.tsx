import { FC, useState } from 'react';

const About: FC = () => {
    // @ts-ignore
    const [about] = useState<Array<string>>(window.about);

    return (
        <ul className="versions">
            <li className="node-version">指导老师： 呼克佑</li>
            <li className="chrome-version">成员：{ about.join(' ') } </li>
        </ul>
    );
};

export default About;
