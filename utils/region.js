const prov = ['北京', '天津', '广东', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '河北', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '台湾', '澳门', '香港']

const citys = [
  {
    pid: 0,
    city: ['北京市']
  },
  {
    pid: 1,
    city: ['天津市']
  },
  {
    pid: 2,
    city: ['广州市', '深圳市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市', '珠海市', '汕头市', '韶关市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市']
  },
  {
    pid: 3,
    city: ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '忻州市', '吕梁市', '晋中市', '临汾市', '运城市']
  },
  {
    pid: 4,
    city: ['呼和浩特市', '包头市', '乌海市', '赤峰市', '呼伦贝尔市', '兴安盟', '通辽市', '锡林郭勒盟', '乌兰察布盟', '伊克昭盟', '巴彦淖尔盟', '阿拉善盟']
  },
  {
    pid: 5,
    city: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦', '铁岭市', '朝阳市', '葫芦岛市', '其他']
  },
  {
    pid: 6,
    city: ['长春市', '吉林市', '四平', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州', '其他']
  },
  {
    pid: 7,
    city: ['哈尔滨市', '齐齐哈尔市', '鹤岗市', '双鸭山', '鸡西市', '大庆市', '伊春市', '牡丹江市', '佳木斯市', '七台河市', '黑河市', '绥化市', '大兴安岭地区', '其他']
  },
  {
    pid: 8,
    city: ['上海市']
  },
  {
    pid: 9,
    city: ['南京市', '苏州市', '无锡市', '常州市', '镇江市', '南通市', '泰州市', '扬州市', '盐城市', '连云港市', '徐州市', '淮安市', '宿迁市', '其他']
  },
  {
    pid: 10,
    city: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市', '其他市']
  },
  {
    pid: 11,
    city: ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '巢湖市', '六安市', '亳州市', '池州市', '宣城市', '其他市']
  },
  {
    pid: 12,
    city: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市', '其他']
  },
  {
    pid: 13,
    city: ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市', '其他']
  },
  {
    pid: 14,
    city: ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市', '其他']
  },
  {
    pid: 15,
    city: ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '焦作市', '其他']
  },
  {
    pid: 16,
    city: ['武汉市', '黄石市', '十堰市', '荆州市', '宜昌市', '襄樊市', '鄂州市', '荆门市', '孝感市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '仙桃市', '天门市', '潜江市', '神农架林区', '其他']
  },
  {
    pid: 17,
    city: ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州', '其他']
  },
  {
    pid: 18,
    city: ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口', '承德市', '沧州市', '廊坊市', '衡水市']
  },
  {
    pid: 19,
    city: ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市', '其他市']
  },
  {
    pid: 20,
    city: ['海口市', '三亚市', '五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县', '其他']
  },
  {
    pid: 21,
    city: ['重庆市']
  },
  {
    pid: 22,
    city: ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州', '其他']
  },
  {
    pid: 23,
    city: ['贵阳市', '六盘水市', '遵义市', '安顺市', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '其他']
  },
  {
    pid: 24,
    city: ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '大理白族自治州', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '其他']
  },
  {
    pid: 25,
    city: ['拉萨市', '那曲地区', '昌都地区', '林芝地区', '山南地区', '日喀则地区', '阿里地区', '其他']
  },
  {
    pid: 26,
    city: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市', '其他']
  },
  {
    pid: 27,
    city: ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '酒泉市', '张掖市', '庆阳市', '平凉市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州', '其他']
  },
  {
    pid: 28,
    city: ['西宁市', '海东地区', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州', '其他']
  },
  {
    pid: 29,
    city: ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市', '其他']
  },
  {
    pid: 30,
    city: ['乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '和田地区', '阿克苏地区', '喀什地区', '克孜勒苏柯尔克孜自治州', '巴音郭楞蒙古自治州', '昌吉回族自治州', '博尔塔拉蒙古自治州', '石河子', '阿拉尔', '图木舒克', '五家渠', '伊犁哈萨克自治州', '其他']
  },
  {
    pid: 31,
    city: ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市']
  },
  {
    pid: 32,
    city: ['澳门']
  },
  {
    pid: 33,
    city: ['香港']
  }
]

module.exports = {
  prov,
  citys
}