/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { useOutlet } from 'umi';

const Layout = () => {
  const outlet = useOutlet();
  return (
    <div>
      <div>{outlet}</div>

      <div style={{display: "flex", justifyContent: "center"}}>
        <p>© 2026 zhishiliu.top 版权所有 ICP证: 晋ICP备2026007443号-1</p>
      </div>
    </div>
  );
};

export default Layout;
