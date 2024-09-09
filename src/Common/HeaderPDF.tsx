import { StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import logoLight from "assets/images/SRC.png";
import anis from "assets/images/anis.png";
import { Link } from "react-router-dom";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    paddingBottom: 16,
  },
  h1: {
    fontSize: 14,
    fontWeight: 600,
  },
  h2: {
    fontSize: 10,
    fontWeight: "medium",
  },
  left: {
    flex: 1,
  },
  right: {
    // textAlign: 'right',
  },
  image: {
    width: 140,
    border: 3,
    borderStyle: "dashed",
  },
  num: {
    fontWeight: "thin",
    fontSize: 9,
  },
});

const HeaderPDF: React.FC = () => {
  const handleEmailPress = () => {
    window.open("mailto:info@boudencoachtravel.co.uk");
  };
  return (
    <View>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            style={{
              textAlign: "right",
              width: 100,
              border: 3,
              borderStyle: "dashed",
            }}
            src={logoLight}
          />
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}> Bouden Travel ltd </Text>
          <Text style={styles.h2}>
            UNIT 7 HAYWARDS INDUSTRIAL PARK ORTON WAY BIRMINGHAM
          </Text>
          <Text style={styles.h2}>B35 7BT</Text>
          <Text style={styles.h2}>08001123770</Text>
          <Text style={styles.h2}>info@boudencoachtravel.co.uk</Text>
          {/* <Text style={{ fontSize: 10.5, fontWeight: "bold" }}>
            M.F: <Text style={styles.h2}>1687166/T</Text>
          </Text> */}
        </View>
        <Image
          style={{
            textAlign: "right",
            width: 100,
          }}
          src={anis}
        />
      </View>
    </View>
  );
};

export default HeaderPDF;
